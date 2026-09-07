import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { ActiveSessionCard } from "@/components/workout/active-session-card"
import { TemplateSummaryCard } from "@/components/workout/template-summary-card"
import { WorkoutItemCard } from "@/components/workout/workout-item-card"
import { useWorkout } from "@/lib/workout/workout-context"

export const Route = createFileRoute("/_app/session")({
  component: SessionPage,
})

function SessionPage() {
  const {
    activeSession,
    templates,
    startSession,
    cancelSession,
    updateActiveSessionDate,
    updateActiveSessionItem,
    finishSession,
  } = useWorkout()

  if (activeSession) {
    return (
      <div>
        <ActiveSessionCard
          session={activeSession}
          onDateChange={updateActiveSessionDate}
        />

        <div className="flex flex-col gap-2">
          {activeSession.items.map((item) => (
            <WorkoutItemCard
              key={item.id}
              item={item}
              onChange={(patch) => updateActiveSessionItem(item.id, patch)}
              onToggleRepsType={() =>
                updateActiveSessionItem(item.id, {
                  repsType: item.repsType === "sec" ? "reps" : "sec",
                })
              }
            />
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={cancelSession}
          >
            Annuler
          </Button>
          <Button type="button" className="flex-1" onClick={finishSession}>
            Terminer la séance
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-3.5 text-sm text-muted-foreground">
        Choisir un template pour commencer
      </p>
      {templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Créez d'abord un template dans l'onglet Templates
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {templates.map((template) => (
            <TemplateSummaryCard
              key={template.id}
              template={template}
              variant="start"
              onStart={() => startSession(template)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
