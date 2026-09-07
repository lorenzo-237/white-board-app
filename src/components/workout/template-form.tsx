import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AvailableExerciseRow } from "@/components/workout/available-exercise-row"
import { CategoryPicker } from "@/components/workout/category-picker"
import { WorkoutItemCard } from "@/components/workout/workout-item-card"
import { TEMPLATE_CATEGORIES } from "@/lib/workout/constants"
import { createId } from "@/lib/workout/format"
import type {
  Exercise,
  Template,
  TemplateCategory,
  WorkoutItem,
} from "@/lib/workout/types"

export function TemplateForm({
  initialTemplate,
  exercises,
  onSave,
  onCancel,
}: {
  initialTemplate: Template
  exercises: Array<Exercise>
  onSave: (template: Template) => void
  onCancel: () => void
}) {
  const [template, setTemplate] = React.useState<Template>(initialTemplate)

  function updateItem(itemId: string, patch: Partial<WorkoutItem>) {
    setTemplate((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item
      ),
    }))
  }

  function toggleRepsType(itemId: string) {
    setTemplate((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId
          ? { ...item, repsType: item.repsType === "sec" ? "reps" : "sec" }
          : item
      ),
    }))
  }

  function removeItem(itemId: string) {
    setTemplate((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== itemId),
    }))
  }

  function addItem(exercise: Exercise) {
    setTemplate((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: createId(),
          exerciseId: exercise.id,
          name: exercise.name,
          sets: 3,
          reps: 8,
          repsType: "reps",
          weight: "",
        },
      ],
    }))
  }

  function setCategory(category: TemplateCategory) {
    setTemplate((current) => ({ ...current, category }))
  }

  const usedExerciseIds = new Set(template.items.map((item) => item.exerciseId))
  const availableExercises = exercises.filter(
    (exercise) =>
      (exercise.category === "commun" ||
        exercise.category === template.category) &&
      !usedExerciseIds.has(exercise.id)
  )

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const name = template.name.trim()
    if (!name || template.items.length === 0) return
    onSave({ ...template, name })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <Input
          autoFocus
          placeholder="Nom du template (ex: Push day)"
          value={template.name}
          onChange={(event) =>
            setTemplate((current) => ({ ...current, name: event.target.value }))
          }
          className="text-base font-semibold"
        />
        <CategoryPicker
          categories={TEMPLATE_CATEGORIES}
          value={template.category}
          onChange={setCategory}
        />
      </div>

      <section>
        <h3 className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Exercices du template
        </h3>
        {template.items.length === 0 ? (
          <p className="pb-2 text-sm text-muted-foreground">
            Ajoutez des exercices ci-dessous
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {template.items.map((item) => (
              <WorkoutItemCard
                key={item.id}
                item={item}
                onChange={(patch) => updateItem(item.id, patch)}
                onToggleRepsType={() => toggleRepsType(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Ajouter un exercice
        </h3>
        {availableExercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tous les exercices disponibles sont ajoutés
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {availableExercises.map((exercise) => (
              <AvailableExerciseRow
                key={exercise.id}
                exercise={exercise}
                onAdd={() => addItem(exercise)}
              />
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button type="submit" className="flex-1">
          Enregistrer
        </Button>
      </div>
    </form>
  )
}
