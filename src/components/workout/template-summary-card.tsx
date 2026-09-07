import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryLabel } from "@/components/workout/category-label"
import { ConfirmDeleteDialog } from "@/components/workout/confirm-delete-dialog"
import { pluralize } from "@/lib/workout/format"
import type { Template } from "@/lib/workout/types"

interface TemplateSummaryCardProps {
  template: Template
  variant: "manage" | "start"
  onEdit?: () => void
  onDelete?: () => void
  onStart?: () => void
}

export function TemplateSummaryCard({
  template,
  variant,
  onEdit,
  onDelete,
  onStart,
}: TemplateSummaryCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-base font-semibold">
            {template.name}
          </span>
          <CategoryLabel category={template.category} />
        </div>
        <p className="text-sm text-muted-foreground">
          {pluralize(template.items.length, "exercice")}
        </p>
        {variant === "manage" ? (
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onEdit}
            >
              Modifier
            </Button>
            <ConfirmDeleteDialog
              trigger="Supprimer"
              triggerElement={
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                />
              }
              title="Supprimer ce template ?"
              description={`« ${template.name} » et sa configuration seront supprimés définitivement.`}
              onConfirm={() => onDelete?.()}
            />
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            className="mt-2 self-end"
            onClick={onStart}
          >
            Commencer
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
