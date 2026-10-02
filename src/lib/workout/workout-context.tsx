import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createExercise,
  deleteExercise as deleteExerciseFn,
  listExercises,
  renameExercise as renameExerciseFn,
} from "@/lib/workout/server/exercises"
import {
  createSession,
  deleteSession as deleteSessionFn,
  listSessions,
} from "@/lib/workout/server/sessions"
import {
  deleteTemplate as deleteTemplateFn,
  listTemplates,
  saveTemplate as saveTemplateFn,
} from "@/lib/workout/server/templates"
import { createId } from "@/lib/workout/format"
import type {
  ActiveSession,
  Category,
  Exercise,
  Template,
  WorkoutItem,
  WorkoutSession,
} from "@/lib/workout/types"

const QUERY_KEYS = {
  exercises: ["exercises"] as const,
  templates: ["templates"] as const,
  sessions: ["sessions"] as const,
}

export interface WorkoutContextValue {
  exercises: Array<Exercise>
  templates: Array<Template>
  sessions: Array<WorkoutSession>
  activeSession: ActiveSession | null
  addExercise: (name: string, category: Category) => void
  renameExercise: (id: string, name: string) => void
  deleteExercise: (id: string) => void
  saveTemplate: (template: Template) => void
  deleteTemplate: (id: string) => void
  startSession: (template: Template) => void
  cancelSession: () => void
  updateActiveSessionDate: (date: string) => void
  updateActiveSessionItem: (itemId: string, patch: Partial<WorkoutItem>) => void
  finishSession: () => void
  isFinishingSession: boolean
  finishSessionFailed: boolean
  deleteSession: (id: string) => void
}

const WorkoutContext = React.createContext<WorkoutContextValue | null>(null)

function activeSessionStorageKey(userId: string) {
  return `white-board:active-session:${userId}`
}

/**
 * Keeps the in-progress session in localStorage so it survives the phone
 * killing the (PWA) app between sets. Read after mount to avoid an SSR
 * hydration mismatch; storage failures are ignored (private mode, quota...).
 */
function usePersistedActiveSession(userId: string) {
  const storageKey = activeSessionStorageKey(userId)
  const [activeSession, setActiveSession] =
    React.useState<ActiveSession | null>(null)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored) setActiveSession(JSON.parse(stored) as ActiveSession)
    } catch {
      // Unreadable or corrupted entry: start without an active session.
    }
    setHydrated(true)
  }, [storageKey])

  React.useEffect(() => {
    if (!hydrated) return
    try {
      if (activeSession) {
        window.localStorage.setItem(storageKey, JSON.stringify(activeSession))
      } else {
        window.localStorage.removeItem(storageKey)
      }
    } catch {
      // Storage unavailable: the session simply isn't persisted.
    }
  }, [activeSession, hydrated, storageKey])

  return [activeSession, setActiveSession] as const
}

export function WorkoutProvider({
  userId,
  children,
}: {
  userId: string
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [activeSession, setActiveSession] = usePersistedActiveSession(userId)

  const exercisesQuery = useQuery({
    queryKey: QUERY_KEYS.exercises,
    queryFn: () => listExercises(),
  })
  const templatesQuery = useQuery({
    queryKey: QUERY_KEYS.templates,
    queryFn: () => listTemplates(),
  })
  const sessionsQuery = useQuery({
    queryKey: QUERY_KEYS.sessions,
    queryFn: () => listSessions(),
  })

  const addExerciseMutation = useMutation({
    mutationFn: (input: { name: string; category: Category }) =>
      createExercise({ data: input }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises }),
  })
  const renameExerciseMutation = useMutation({
    mutationFn: (input: { id: string; name: string }) =>
      renameExerciseFn({ data: input }),
    // Template items are renamed too, so both lists are stale.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templates }),
      ]),
  })
  const deleteExerciseMutation = useMutation({
    mutationFn: (id: string) => deleteExerciseFn({ data: { id } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises }),
  })
  const saveTemplateMutation = useMutation({
    mutationFn: (template: Template) => saveTemplateFn({ data: template }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templates }),
  })
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => deleteTemplateFn({ data: { id } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.templates }),
  })
  const createSessionMutation = useMutation({
    mutationFn: (session: ActiveSession) => createSession({ data: session }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions }),
  })
  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => deleteSessionFn({ data: { id } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions }),
  })

  const value: WorkoutContextValue = {
    exercises: exercisesQuery.data ?? [],
    templates: templatesQuery.data ?? [],
    sessions: sessionsQuery.data ?? [],
    activeSession,
    addExercise: (name, category) =>
      addExerciseMutation.mutate({ name: name.trim(), category }),
    renameExercise: (id, name) =>
      renameExerciseMutation.mutate({ id, name: name.trim() }),
    deleteExercise: (id) => deleteExerciseMutation.mutate(id),
    saveTemplate: (template) => saveTemplateMutation.mutate(template),
    deleteTemplate: (id) => deleteTemplateMutation.mutate(id),
    startSession: (template) =>
      setActiveSession({
        templateId: template.id,
        templateName: template.name,
        date: new Date().toISOString().slice(0, 10),
        // Fresh ids: SessionItem ids must not reuse the template items' ids,
        // or a second session from the same template hits a unique constraint.
        items: template.items.map((item) => ({ ...item, id: createId() })),
      }),
    cancelSession: () => setActiveSession(null),
    updateActiveSessionDate: (date) =>
      setActiveSession((current) => (current ? { ...current, date } : current)),
    updateActiveSessionItem: (itemId, patch) =>
      setActiveSession((current) =>
        current
          ? {
              ...current,
              items: current.items.map((item) =>
                item.id === itemId ? { ...item, ...patch } : item
              ),
            }
          : current
      ),
    finishSession: () => {
      if (!activeSession) return
      // Only drop the local copy once the server has it, so a network
      // failure never loses the session.
      createSessionMutation.mutate(activeSession, {
        onSuccess: () => setActiveSession(null),
      })
    },
    isFinishingSession: createSessionMutation.isPending,
    finishSessionFailed: createSessionMutation.isError,
    deleteSession: (id) => deleteSessionMutation.mutate(id),
  }

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  )
}

export function useWorkout(): WorkoutContextValue {
  const context = React.useContext(WorkoutContext)
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider")
  }
  return context
}
