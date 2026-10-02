import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { CategoryLabel } from "@/components/workout/category-label"
import type { Exercise } from "@/lib/workout/types"

export function AvailableExerciseRow({
  exercise,
  count,
  onAdd,
}: {
  exercise: Exercise
  /** How many times the exercise is already in the template. */
  count: number
  onAdd: () => void
}) {
  return (
    <Item variant="outline" size="sm" className="justify-between">
      <ItemContent>
        <ItemTitle className="font-normal">
          {exercise.name}
          <CategoryLabel category={exercise.category} className="text-[10px]" />
        </ItemTitle>
      </ItemContent>
      <div className="flex items-center gap-2">
        {count > 0 && (
          <span
            className="min-w-6 rounded-full bg-primary/10 px-1.5 py-0.5 text-center text-xs font-bold text-primary tabular-nums"
            aria-label={`Déjà ${count} fois dans le template`}
          >
            ×{count}
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-primary"
          onClick={onAdd}
          aria-label={`Ajouter ${exercise.name} au template`}
        >
          +
        </Button>
      </div>
    </Item>
  )
}
