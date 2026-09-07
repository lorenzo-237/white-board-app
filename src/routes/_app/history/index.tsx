import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { HistoryFilterChips } from "@/components/workout/history-filter-chips"
import { HistorySessionCard } from "@/components/workout/history-session-card"
import { useWorkout } from "@/lib/workout/workout-context"

export const Route = createFileRoute("/_app/history/")({
  validateSearch: (search: Record<string, unknown>): { filter: string } => ({
    filter: typeof search.filter === "string" ? search.filter : "all",
  }),
  component: HistoryPage,
})

function HistoryPage() {
  const { filter } = Route.useSearch()
  const navigate = useNavigate()
  const { sessions, templates } = useWorkout()

  const filterOptions = [
    { value: "all", label: "Tous" },
    ...templates.map((template) => ({
      value: template.id,
      label: template.name,
    })),
  ]
  const filteredSessions = sessions.filter(
    (session) => filter === "all" || session.templateId === filter
  )

  return (
    <div>
      <HistoryFilterChips
        options={filterOptions}
        value={filter}
        onChange={(value) =>
          navigate({ to: "/history", search: { filter: value } })
        }
      />

      {filteredSessions.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">
          Aucune séance enregistrée
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredSessions.map((session) => (
            <HistorySessionCard
              key={session.id}
              session={session}
              onSelect={() =>
                navigate({
                  to: "/history/$sessionId",
                  params: { sessionId: session.id },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
