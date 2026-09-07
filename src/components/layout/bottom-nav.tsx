import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"

import { NAV_ITEMS } from "@/components/layout/nav-items"

export function BottomNav() {
  return (
    <nav className="flex shrink-0 border-t bg-card">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: false }}
          activeProps={{ className: "border-primary text-primary" }}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 border-t-2 border-transparent py-3.5 text-muted-foreground"
        >
          <HugeiconsIcon icon={item.icon} strokeWidth={1.9} />
          <span className="sr-only">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
