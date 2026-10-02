import { ItemGroup } from "@/components/ui/item"
import { ExerciseListItem } from "@/components/workout/exercise-list-item"
import { cn } from "@/lib/utils"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/workout/constants"
import type { Category, Exercise } from "@/lib/workout/types"

export function ExerciseSection({
  category,
  exercises,
  onRenameExercise,
  onDeleteExercise,
}: {
  category: Category
  exercises: Array<Exercise>
  onRenameExercise: (id: string, name: string) => void
  onDeleteExercise: (id: string) => void
}) {
  return (
    <section className="mb-5">
      <h3
        className={cn(
          "mb-2 text-xs font-bold tracking-wide uppercase",
          CATEGORY_COLORS[category].text
        )}
      >
        {CATEGORY_LABELS[category]}
      </h3>
      {exercises.length === 0 ? (
        <p className="py-1 text-sm text-muted-foreground">Aucun exercice</p>
      ) : (
        <ItemGroup className="gap-1.5">
          {exercises.map((exercise) => (
            <ExerciseListItem
              key={exercise.id}
              exercise={exercise}
              onRename={(name) => onRenameExercise(exercise.id, name)}
              onDelete={() => onDeleteExercise(exercise.id)}
            />
          ))}
        </ItemGroup>
      )}
    </section>
  )
}
