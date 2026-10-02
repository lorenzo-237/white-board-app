import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  PencilEdit02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { ConfirmDeleteDialog } from "@/components/workout/confirm-delete-dialog"
import type { Exercise } from "@/lib/workout/types"

export function ExerciseListItem({
  exercise,
  onRename,
  onDelete,
}: {
  exercise: Exercise
  onRename: (name: string) => void
  onDelete: () => void
}) {
  const [draftName, setDraftName] = React.useState<string | null>(null)

  if (draftName !== null) {
    const submit = (event: React.FormEvent) => {
      event.preventDefault()
      const trimmed = draftName.trim()
      if (!trimmed) return
      if (trimmed !== exercise.name) onRename(trimmed)
      setDraftName(null)
    }

    return (
      <Item variant="outline" size="sm" className="justify-between">
        <form onSubmit={submit} className="flex flex-1 items-center gap-1.5">
          <Input
            autoFocus
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setDraftName(null)
            }}
            aria-label="Nouveau nom de l'exercice"
            className="h-7 flex-1"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon-xs"
            className="text-primary"
            disabled={!draftName.trim()}
            aria-label="Valider le nouveau nom"
          >
            <HugeiconsIcon icon={Tick02Icon} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
            onClick={() => setDraftName(null)}
            aria-label="Annuler le renommage"
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </Button>
        </form>
      </Item>
    )
  }

  return (
    <Item variant="outline" size="sm" className="justify-between">
      <ItemContent>
        <ItemTitle className="font-normal">{exercise.name}</ItemTitle>
      </ItemContent>
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground"
          onClick={() => setDraftName(exercise.name)}
          aria-label={`Renommer ${exercise.name}`}
        >
          <HugeiconsIcon icon={PencilEdit02Icon} />
        </Button>
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
      </div>
    </Item>
  )
}
