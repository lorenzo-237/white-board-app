import { cn } from "@/lib/utils"
import type { UserStatus } from "@/lib/auth/types"

const STATUS_LABELS: Record<UserStatus, string> = {
  PENDING: "En attente",
  ACTIVE: "Actif",
  BLOCKED: "Bloqué",
}

const STATUS_COLORS: Record<UserStatus, string> = {
  PENDING: "text-amber-600 dark:text-amber-400",
  ACTIVE: "text-emerald-600 dark:text-emerald-400",
  BLOCKED: "text-destructive",
}

export function UserStatusLabel({
  status,
  className,
}: {
  status: UserStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "text-xs font-bold tracking-wide uppercase",
        STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
