import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createExercise,
  deleteExercise as deleteExerciseFn,
  listExercises,
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
  deleteExercise: (id: string) => void
  saveTemplate: (template: Template) => void
  deleteTemplate: (id: string) => void
  startSession: (template: Template) => void
  cancelSession: () => void
  updateActiveSessionDate: (date: string) => void
  updateActiveSessionItem: (itemId: string, patch: Partial<WorkoutItem>) => void
  finishSession: () => void
  deleteSession: (id: string) => void
}

const WorkoutContext = React.createContext<WorkoutContextValue | null>(null)

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [activeSession, setActiveSession] =
    React.useState<ActiveSession | null>(null)

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
    deleteExercise: (id) => deleteExerciseMutation.mutate(id),
    saveTemplate: (template) => saveTemplateMutation.mutate(template),
    deleteTemplate: (id) => deleteTemplateMutation.mutate(id),
    startSession: (template) =>
      setActiveSession({
        templateId: template.id,
        templateName: template.name,
        category: template.category,
        date: new Date().toISOString().slice(0, 10),
        items: template.items.map((item) => ({ ...item })),
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
      createSessionMutation.mutate(activeSession)
      setActiveSession(null)
    },
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
