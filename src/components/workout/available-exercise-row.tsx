import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { CategoryLabel } from "@/components/workout/category-label"
import type { Exercise } from "@/lib/workout/types"

export function AvailableExerciseRow({
  exercise,
  onAdd,
}: {
  exercise: Exercise
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
    </Item>
  )
}
