import { UserMenu } from "@/components/layout/user-menu"
import type { AuthUser } from "@/lib/auth/types"

export function AppHeader({ title, user }: { title: string; user: AuthUser }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-card px-5 pt-5 pb-3.5">
      <h1 className="font-heading text-xl font-semibold tracking-tight">
        {title}
      </h1>
      <UserMenu user={user} />
    </header>
  )
}
