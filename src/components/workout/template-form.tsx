import * as React from "react"

import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AvailableExerciseRow } from "@/components/workout/available-exercise-row"
import { WorkoutItemCard } from "@/components/workout/workout-item-card"
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  EXERCISE_CATEGORIES,
} from "@/lib/workout/constants"
import { createId } from "@/lib/workout/format"
import { cn } from "@/lib/utils"
import type {
  Category,
  Exercise,
  Template,
  WorkoutItem,
} from "@/lib/workout/types"

const CATEGORY_FILTER_OPTIONS: Array<{
  value: Category | "all"
  label: string
}> = [
  { value: "all", label: "Tous" },
  ...EXERCISE_CATEGORIES.map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
  })),
]

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
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<Category | "all">(
    "all"
  )

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

  function moveItem(itemId: string, direction: -1 | 1) {
    setTemplate((current) => {
      const index = current.items.findIndex((item) => item.id === itemId)
      const targetIndex = index + direction
      if (
        index === -1 ||
        targetIndex < 0 ||
        targetIndex >= current.items.length
      )
        return current
      const items = [...current.items]
      ;[items[index], items[targetIndex]] = [items[targetIndex], items[index]]
      return { ...current, items }
    })
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
          category: exercise.category,
          sets: 3,
          reps: 8,
          repsType: "reps",
          weight: "",
          description: "",
          ascendingSets: null,
        },
      ],
    }))
  }

  const availableExercises = exercises.filter((exercise) => {
    if (categoryFilter !== "all" && exercise.category !== categoryFilter)
      return false
    if (
      searchQuery.trim() &&
      !exercise.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      return false
    }
    return true
  })

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const name = template.name.trim()
    if (!name) {
      setError("Le nom du template est obligatoire")
      return
    }
    if (template.items.length === 0) {
      setError("Ajoute au moins un exercice au template")
      return
    }
    setError(null)
    onSave({ ...template, name })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        autoFocus
        placeholder="Nom du template (ex: Push day)"
        value={template.name}
        onChange={(event) =>
          setTemplate((current) => ({ ...current, name: event.target.value }))
        }
        className="text-base font-semibold"
      />

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
            {template.items.map((item, index) => (
              <WorkoutItemCard
                key={item.id}
                item={item}
                onChange={(patch) => updateItem(item.id, patch)}
                editableDescription
                onToggleRepsType={() => toggleRepsType(item.id)}
                onRemove={() => removeItem(item.id)}
                onMoveUp={index > 0 ? () => moveItem(item.id, -1) : undefined}
                onMoveDown={
                  index < template.items.length - 1
                    ? () => moveItem(item.id, 1)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Ajouter un exercice
        </h3>
        <Input
          placeholder="Rechercher un exercice par son nom…"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="mb-2"
        />
        <div className="mb-3 grid grid-cols-3 gap-1.5">
          {CATEGORY_FILTER_OPTIONS.map((option) => {
            const isActive = categoryFilter === option.value
            const colors =
              option.value !== "all" ? CATEGORY_COLORS[option.value] : null
            return (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCategoryFilter(option.value)}
                className={cn(
                  "w-full font-semibold",
                  isActive &&
                    (colors
                      ? cn(
                          colors.solidBg,
                          colors.solidText,
                          "border-transparent hover:opacity-90"
                        )
                      : "border-transparent bg-primary text-primary-foreground hover:opacity-90")
                )}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
        {availableExercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun exercice ne correspond
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

      {error && <FieldError>{error}</FieldError>}

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
