import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CategoryPicker } from "@/components/workout/category-picker"
import { EXERCISE_CATEGORIES } from "@/lib/workout/constants"
import type { Category } from "@/lib/workout/types"

export function AddExerciseForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string, category: Category) => void
  onCancel: () => void
}) {
  const [name, setName] = React.useState("")
  const [category, setCategory] = React.useState<Category>("commun")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit(trimmed, category)
    setName("")
    setCategory("commun")
  }

  return (
    <Card size="sm" className="mb-4">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <Input
            autoFocus
            placeholder="Nom de l'exercice (ex: Soulevé de terre)"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <CategoryPicker
            categories={EXERCISE_CATEGORIES}
            value={category}
            onChange={setCategory}
          />
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
