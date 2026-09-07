import * as React from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { TemplateForm } from "@/components/workout/template-form"
import { createId } from "@/lib/workout/format"
import type { Template } from "@/lib/workout/types"
import { useWorkout } from "@/lib/workout/workout-context"

export const Route = createFileRoute("/_app/templates/new")({
  component: NewTemplatePage,
})

function NewTemplatePage() {
  const { exercises, saveTemplate } = useWorkout()
  const navigate = useNavigate()
  const [blankTemplate] = React.useState<Template>(() => ({
    id: createId(),
    name: "",
    category: "haut",
    items: [],
  }))

  return (
    <TemplateForm
      initialTemplate={blankTemplate}
      exercises={exercises}
      onSave={(template) => {
        saveTemplate(template)
        navigate({ to: "/templates" })
      }}
      onCancel={() => navigate({ to: "/templates" })}
    />
  )
}
