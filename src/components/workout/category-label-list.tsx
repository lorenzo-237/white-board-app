import { CategoryLabel } from "@/components/workout/category-label"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/workout/types"

export function CategoryLabelList({
  categories,
  className,
}: {
  categories: Array<Category>
  className?: string
}) {
  if (categories.length === 0) return null
  return (
    <div
      className={cn(
        "flex flex-wrap justify-end gap-x-1.5 gap-y-0.5",
        className
      )}
    >
      {categories.map((category) => (
        <CategoryLabel key={category} category={category} />
      ))}
    </div>
  )
}
