import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { TemplateSummaryCard } from "@/components/workout/template-summary-card"
import { useWorkout } from "@/lib/workout/workout-context"

export const Route = createFileRoute("/_app/templates/")({
  component: TemplatesPage,
})

function TemplatesPage() {
  const { templates, deleteTemplate } = useWorkout()
  const navigate = useNavigate()

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="mb-4 w-full border-dashed text-primary"
        onClick={() => navigate({ to: "/templates/new" })}
      >
        + Nouveau template
      </Button>

      {templates.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">
          Aucun template pour l'instant
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {templates.map((template) => (
            <TemplateSummaryCard
              key={template.id}
              template={template}
              variant="manage"
              onEdit={() =>
                navigate({
                  to: "/templates/$templateId",
                  params: { templateId: template.id },
                })
              }
              onDelete={() => deleteTemplate(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
