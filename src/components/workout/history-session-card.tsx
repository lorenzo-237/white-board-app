import { Card, CardContent } from "@/components/ui/card"
import { CategoryLabel } from "@/components/workout/category-label"
import { formatSessionDate, pluralize } from "@/lib/workout/format"
import type { WorkoutSession } from "@/lib/workout/types"

export function HistorySessionCard({
  session,
  onSelect,
}: {
  session: WorkoutSession
  onSelect: () => void
}) {
  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect()
      }}
      className="cursor-pointer transition-colors hover:bg-muted/40"
    >
      <CardContent className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-base font-semibold">
            {session.templateName}
          </span>
          <CategoryLabel category={session.category} />
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          {formatSessionDate(session.date)} ·{" "}
          {pluralize(session.items.length, "exercice")}
        </p>
      </CardContent>
    </Card>
  )
}
