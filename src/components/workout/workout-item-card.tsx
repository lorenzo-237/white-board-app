import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { WorkoutItem } from "@/lib/workout/types"

export function WorkoutItemCard({
  item,
  onChange,
  onToggleRepsType,
  onRemove,
}: {
  item: WorkoutItem
  onChange: (patch: Partial<WorkoutItem>) => void
  onToggleRepsType: () => void
  onRemove?: () => void
}) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{item.name}</span>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={onRemove}
              aria-label={`Retirer ${item.name}`}
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </Button>
          )}
        </div>
        <div className="flex items-end gap-1.5">
          <div className="flex flex-col gap-1">
            <Label className="text-[11px] font-normal text-muted-foreground">
              Séries
            </Label>
            <Input
              type="number"
              min={1}
              value={item.sets}
              onChange={(event) =>
                onChange({ sets: Number(event.target.value) || 0 })
              }
              className="w-14 rounded-lg px-2 text-center font-mono"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-[11px] font-normal text-muted-foreground">
              {item.repsType === "sec" ? "Secondes" : "Répétitions"}
            </Label>
            <Input
              type="number"
              min={1}
              value={item.reps}
              onChange={(event) =>
                onChange({ reps: Number(event.target.value) || 0 })
              }
              className="w-14 rounded-lg px-2 text-center font-mono"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleRepsType}
            className="self-end font-normal text-muted-foreground"
          >
            {item.repsType === "sec" ? "sec" : "reps"}
          </Button>
          <div className="flex flex-1 flex-col gap-1">
            <Label className="text-[11px] font-normal text-muted-foreground">
              Poids (optionnel)
            </Label>
            <Input
              type="number"
              min={0}
              step={0.5}
              placeholder="kg"
              value={item.weight}
              onChange={(event) => onChange({ weight: event.target.value })}
              className="rounded-lg px-2 text-center font-mono"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
