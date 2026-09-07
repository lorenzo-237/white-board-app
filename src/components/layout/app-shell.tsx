import * as React from "react"
import { useLocation } from "@tanstack/react-router"

import { AppHeader } from "@/components/layout/app-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { EXTRA_PAGE_TITLES, NAV_ITEMS } from "@/components/layout/nav-items"
import type { AuthUser } from "@/lib/auth/types"

function usePageTitle(): string {
  const pathname = useLocation({ select: (location) => location.pathname })
  const navTitle = NAV_ITEMS.find((item) => pathname.startsWith(item.to))?.label
  if (navTitle) return navTitle
  const extraEntry = Object.entries(EXTRA_PAGE_TITLES).find(([path]) =>
    pathname.startsWith(path)
  )
  return extraEntry?.[1] ?? ""
}

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: AuthUser
}) {
  const title = usePageTitle()

  return (
    <div className="mx-auto flex h-svh w-full max-w-[480px] flex-col overflow-hidden bg-background">
      <AppHeader title={title} user={user} />
      <main className="flex-1 overflow-y-auto p-4 pb-6">{children}</main>
      <BottomNav />
    </div>
  )
}
