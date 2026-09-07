import { cn } from "@/lib/utils"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/workout/constants"
import type { Category } from "@/lib/workout/types"

export function CategoryLabel({
  category,
  className,
}: {
  category: Category
  className?: string
}) {
  return (
    <span
      className={cn(
        "text-xs font-bold tracking-wide uppercase",
        CATEGORY_COLORS[category].text,
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}
