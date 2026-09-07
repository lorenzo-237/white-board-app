import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { getProfileStats, renewSession } from "@/lib/workout/server/profile"
import { formatSessionDate, pluralize } from "@/lib/workout/format"

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
})

const PROFILE_QUERY_KEY = ["profile"] as const

function ProfilePage() {
  const { user } = Route.useRouteContext()
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => getProfileStats(),
  })

  const renewMutation = useMutation({
    mutationFn: () => renewSession(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  })

  const stats = profileQuery.data

  return (
    <div className="flex flex-col gap-4">
      <Card size="sm">
        <CardContent className="flex flex-col gap-1">
          <span className="font-heading text-lg font-semibold">
            {user.name}
          </span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardContent className="flex flex-col gap-3">
          <div>
            <div className="text-3xl font-bold tabular-nums">
              {stats?.daysRemaining ?? "—"}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats
                ? `jour${stats.daysRemaining === 1 ? "" : "s"} avant reconnexion obligatoire`
                : "Chargement…"}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => renewMutation.mutate()}
            disabled={renewMutation.isPending}
          >
            {renewMutation.isPending
              ? "Prolongation…"
              : "Prolonger de 30 jours"}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Statistiques
        </h2>
        <div className="flex flex-col gap-1.5">
          <Item variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="font-normal">Séances au total</ItemTitle>
            </ItemContent>
            <span className="font-mono text-sm font-semibold">
              {stats?.totalSessions ?? "—"}
            </span>
          </Item>
          <Item variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="font-normal">30 derniers jours</ItemTitle>
              <ItemDescription>
                {pluralize(stats?.sessionsLast30Days ?? 0, "séance")}
              </ItemDescription>
            </ItemContent>
            <span className="font-mono text-sm font-semibold">
              {stats?.sessionsLast30Days ?? "—"}
            </span>
          </Item>
          <Item variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="font-normal">Dernière séance</ItemTitle>
            </ItemContent>
            <span className="font-mono text-sm font-semibold">
              {stats?.lastSessionDate
                ? formatSessionDate(stats.lastSessionDate)
                : "—"}
            </span>
          </Item>
        </div>
      </div>
    </div>
  )
}
