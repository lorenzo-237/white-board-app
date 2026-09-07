import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/workout/constants"
import type { Category } from "@/lib/workout/types"

export function CategoryPicker<TCategory extends Category>({
  categories,
  value,
  onChange,
  className,
}: {
  categories: ReadonlyArray<TCategory>
  value: TCategory
  onChange: (category: TCategory) => void
  className?: string
}) {
  return (
    <div className={cn("flex gap-1.5", className)}>
      {categories.map((category) => {
        const isActive = category === value
        const colors = CATEGORY_COLORS[category]
        return (
          <Button
            key={category}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(category)}
            className={cn(
              "flex-1 font-semibold",
              isActive &&
                cn(
                  colors.solidBg,
                  colors.solidText,
                  "border-transparent hover:opacity-90"
                )
            )}
          >
            {CATEGORY_LABELS[category]}
          </Button>
        )
      })}
    </div>
  )
}
