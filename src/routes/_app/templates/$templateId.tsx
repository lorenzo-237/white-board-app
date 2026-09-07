import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { TemplateForm } from "@/components/workout/template-form"
import { WorkoutEmpty } from "@/components/workout/workout-empty"
import { useWorkout } from "@/lib/workout/workout-context"

export const Route = createFileRoute("/_app/templates/$templateId")({
  component: EditTemplatePage,
})

function EditTemplatePage() {
  const { templateId } = Route.useParams()
  const { templates, exercises, saveTemplate } = useWorkout()
  const navigate = useNavigate()
  const template = templates.find((item) => item.id === templateId)

  if (!template) {
    return (
      <WorkoutEmpty
        title="Template introuvable"
        description="Ce template a peut-être été supprimé."
      />
    )
  }

  return (
    <TemplateForm
      key={template.id}
      initialTemplate={template}
      exercises={exercises}
      onSave={(updated) => {
        saveTemplate(updated)
        navigate({ to: "/templates" })
      }}
      onCancel={() => navigate({ to: "/templates" })}
    />
  )
}
