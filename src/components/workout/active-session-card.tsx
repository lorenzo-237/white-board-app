import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CategoryLabelList } from "@/components/workout/category-label-list"
import { getItemCategories } from "@/lib/workout/format"
import type { ActiveSession } from "@/lib/workout/types"

export function ActiveSessionCard({
  session,
  onDateChange,
}: {
  session: ActiveSession
  onDateChange: (date: string) => void
}) {
  return (
    <Card size="sm" className="mb-4">
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-lg font-semibold">
            {session.templateName}
          </span>
          <CategoryLabelList categories={getItemCategories(session.items)} />
        </div>
        <Input
          type="date"
          value={session.date}
          onChange={(event) => onDateChange(event.target.value)}
          className="w-fit font-mono"
        />
      </CardContent>
    </Card>
  )
}
