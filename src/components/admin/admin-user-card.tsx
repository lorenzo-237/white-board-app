import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserStatusLabel } from "@/components/admin/user-status-label"
import type { AdminUser } from "@/lib/admin/server"
import type { UserStatus } from "@/lib/auth/types"

export function AdminUserCard({
  user,
  disabled,
  onSetStatus,
}: {
  user: AdminUser
  disabled: boolean
  onSetStatus: (status: UserStatus) => void
}) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-base font-semibold">
            {user.name}
          </span>
          <UserStatusLabel status={user.status} />
        </div>
        <p className="mb-1 text-sm text-muted-foreground">{user.email}</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={disabled || user.status === "ACTIVE"}
            onClick={() => onSetStatus("ACTIVE")}
          >
            Accepter
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={disabled || user.status === "PENDING"}
            onClick={() => onSetStatus("PENDING")}
          >
            En attente
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="flex-1"
            disabled={disabled || user.status === "BLOCKED"}
            onClick={() => onSetStatus("BLOCKED")}
          >
            Bloquer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
