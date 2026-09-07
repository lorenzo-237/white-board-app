import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { ConfirmDeleteDialog } from "@/components/workout/confirm-delete-dialog"
import type { Exercise } from "@/lib/workout/types"

export function ExerciseListItem({
  exercise,
  onDelete,
}: {
  exercise: Exercise
  onDelete: () => void
}) {
  return (
    <Item variant="outline" size="sm" className="justify-between">
      <ItemContent>
        <ItemTitle className="font-normal">{exercise.name}</ItemTitle>
      </ItemContent>
      <ConfirmDeleteDialog
        trigger={<HugeiconsIcon icon={Cancel01Icon} />}
        triggerElement={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
            aria-label={`Supprimer ${exercise.name}`}
          />
        }
        title="Supprimer cet exercice ?"
        description={`« ${exercise.name} » sera retiré de la liste. Cette action est irréversible.`}
        onConfirm={onDelete}
      />
    </Item>
  )
}
