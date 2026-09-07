import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { SessionDetail } from "@/components/workout/session-detail"
import { WorkoutEmpty } from "@/components/workout/workout-empty"
import { useWorkout } from "@/lib/workout/workout-context"

export const Route = createFileRoute("/_app/history/$sessionId")({
  component: SessionDetailPage,
})

function SessionDetailPage() {
  const { sessionId } = Route.useParams()
  const { sessions, deleteSession } = useWorkout()
  const navigate = useNavigate()
  const session = sessions.find((item) => item.id === sessionId)

  if (!session) {
    return (
      <WorkoutEmpty
        title="Séance introuvable"
        description="Cette séance a peut-être été supprimée."
      />
    )
  }

  return (
    <SessionDetail
      session={session}
      onBack={() => navigate({ to: "/history", search: { filter: "all" } })}
      onDelete={() => {
        deleteSession(session.id)
        navigate({ to: "/history", search: { filter: "all" } })
      }}
    />
  )
}
