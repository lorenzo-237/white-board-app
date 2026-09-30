import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryLabel } from "@/components/workout/category-label"
import type { AscendingStep, WorkoutItem } from "@/lib/workout/types"

export function WorkoutItemCard({
  item,
  onChange,
  onToggleRepsType,
  onRemove,
  onMoveUp,
  onMoveDown,
  editableDescription = false,
}: {
  item: WorkoutItem
  onChange: (patch: Partial<WorkoutItem>) => void
  /** Template editing shows a textarea; otherwise the description is read-only. */
  editableDescription?: boolean
  onToggleRepsType: () => void
  onRemove?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}) {
  const isAscending = !!item.ascendingSets && item.ascendingSets.length > 0

  function toggleAscendingMode() {
    if (isAscending) {
      const [first] = item.ascendingSets as Array<AscendingStep>
      onChange({
        ascendingSets: null,
        sets: (item.ascendingSets as Array<AscendingStep>).length,
        reps: first.reps,
        weight: first.weight,
      })
    } else {
      onChange({ ascendingSets: [{ reps: item.reps, weight: item.weight }] })
    }
  }

  function updateStep(index: number, patch: Partial<AscendingStep>) {
    const steps = (item.ascendingSets ?? []).map((step, i) =>
      i === index ? { ...step, ...patch } : step
    )
    onChange({ ascendingSets: steps })
  }

  function addStep() {
    onChange({
      ascendingSets: [...(item.ascendingSets ?? []), { reps: 8, weight: "" }],
    })
  }

  function removeStep(index: number) {
    const steps = (item.ascendingSets ?? []).filter((_, i) => i !== index)
    onChange({ ascendingSets: steps.length > 0 ? steps : null })
  }

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">
            {item.name}
            {item.category !== "commun" && (
              <CategoryLabel
                category={item.category}
                className="ml-2 text-[10px]"
              />
            )}
          </span>
          <div className="flex items-center">
            {onMoveUp && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onMoveUp}
                aria-label={`Monter ${item.name}`}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} />
              </Button>
            )}
            {onMoveDown && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onMoveDown}
                aria-label={`Descendre ${item.name}`}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} />
              </Button>
            )}
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
        </div>

        {editableDescription ? (
          <textarea
            rows={2}
            placeholder="Instructions (optionnel)"
            value={item.description}
            onChange={(event) => onChange({ description: event.target.value })}
            aria-label={`Instructions pour ${item.name}`}
            className="w-full min-w-0 resize-y rounded-2xl border border-input bg-input/30 px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
          />
        ) : (
          item.description && (
            <p className="text-xs whitespace-pre-line text-muted-foreground">
              {item.description}
            </p>
          )
        )}

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleRepsType}
            className="font-normal text-muted-foreground"
          >
            {item.repsType === "sec" ? "sec" : "reps"}
          </Button>
          <Button
            type="button"
            variant={isAscending ? "default" : "outline"}
            size="sm"
            onClick={toggleAscendingMode}
            className="font-normal"
          >
            Gamme montante
          </Button>
        </div>

        {isAscending ? (
          <div className="flex flex-col gap-2">
            {(item.ascendingSets as Array<AscendingStep>).map((step, index) => (
              <div key={index} className="flex items-end gap-1.5">
                <span className="w-4 pb-2 text-xs text-muted-foreground">
                  {index + 1}.
                </span>
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] font-normal text-muted-foreground">
                    {item.repsType === "sec" ? "Secondes" : "Répétitions"}
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={step.reps}
                    onChange={(event) =>
                      updateStep(index, {
                        reps: Number(event.target.value) || 0,
                      })
                    }
                    className="w-16 rounded-lg px-2 text-center font-mono"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-[11px] font-normal text-muted-foreground">
                    Poids (optionnel)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="kg"
                    value={step.weight}
                    onChange={(event) =>
                      updateStep(index, { weight: event.target.value })
                    }
                    className="rounded-lg px-2 text-center font-mono"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeStep(index)}
                  aria-label={`Retirer le palier ${index + 1}`}
                >
                  <HugeiconsIcon icon={Cancel01Icon} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addStep}>
              + Ajouter un palier
            </Button>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
