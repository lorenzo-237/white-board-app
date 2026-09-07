import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { AddExerciseForm } from "@/components/workout/add-exercise-form"
import { ExerciseSection } from "@/components/workout/exercise-section"
import { EXERCISE_CATEGORIES } from "@/lib/workout/constants"
import { useWorkout } from "@/lib/workout/workout-context"

export const Route = createFileRoute("/_app/exercises")({
  component: ExercisesPage,
})

function ExercisesPage() {
  const { exercises, addExercise, deleteExercise } = useWorkout()
  const [showForm, setShowForm] = React.useState(false)

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="mb-4 w-full border-dashed text-primary"
        onClick={() => setShowForm((current) => !current)}
      >
        {showForm ? "Annuler" : "+ Ajouter un exercice"}
      </Button>

      {showForm && (
        <AddExerciseForm
          onSubmit={(name, category) => {
            addExercise(name, category)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {EXERCISE_CATEGORIES.map((category) => (
        <ExerciseSection
          key={category}
          category={category}
          exercises={exercises.filter(
            (exercise) => exercise.category === category
          )}
          onDeleteExercise={deleteExercise}
        />
      ))}
    </div>
  )
}
