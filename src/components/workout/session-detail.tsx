import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { CategoryLabel } from "@/components/workout/category-label"
import { ConfirmDeleteDialog } from "@/components/workout/confirm-delete-dialog"
import { formatItemSummary, formatSessionDate } from "@/lib/workout/format"
import type { WorkoutSession } from "@/lib/workout/types"

export function SessionDetail({
  session,
  onBack,
  onDelete,
}: {
  session: WorkoutSession
  onBack: () => void
  onDelete: () => void
}) {
  return (
    <div>
      <Button
        type="button"
        variant="link"
        className="mb-3.5 h-auto p-0 text-primary"
        onClick={onBack}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} />
        Retour
      </Button>

      <Card size="sm" className="mb-4">
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-lg font-semibold">
              {session.templateName}
            </span>
            <CategoryLabel category={session.category} />
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            {formatSessionDate(session.date)}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-1.5">
        {session.items.map((item) => (
          <Item key={item.id} variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="font-medium">{item.name}</ItemTitle>
              <ItemDescription className="font-mono">
                {formatItemSummary(item)}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>

      <ConfirmDeleteDialog
        trigger="Supprimer cette séance"
        triggerElement={
          <Button type="button" variant="destructive" className="mt-4 w-full" />
        }
        title="Supprimer cette séance ?"
        description="Cette séance sera définitivement supprimée de l'historique."
        onConfirm={onDelete}
      />
    </div>
  )
}
