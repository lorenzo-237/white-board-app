import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { AppShell } from "@/components/layout/app-shell"
import { getCurrentUser } from "@/lib/auth/server"
import { WorkoutProvider } from "@/lib/workout/workout-context"

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (!user) throw redirect({ to: "/login" })
    if (user.status !== "ACTIVE") throw redirect({ to: "/account-status" })
    return { user }
  },
  component: AppLayout,
})

function AppLayout() {
  const { user } = Route.useRouteContext()

  return (
    <WorkoutProvider>
      <AppShell user={user}>
        <Outlet />
      </AppShell>
    </WorkoutProvider>
  )
}
