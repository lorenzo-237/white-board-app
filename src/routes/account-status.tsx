import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"

import { CenteredPage } from "@/components/layout/centered-page"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCurrentUser, logout } from "@/lib/auth/server"

export const Route = createFileRoute("/account-status")({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (!user) throw redirect({ to: "/login" })
    if (user.status === "ACTIVE") throw redirect({ to: "/" })
    return { user }
  },
  component: AccountStatusPage,
})

function AccountStatusPage() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => navigate({ to: "/login" }),
  })

  const isPending = user.status === "PENDING"

  return (
    <CenteredPage>
      <Card>
        <CardHeader>
          <CardTitle>
            {isPending ? "Compte en attente" : "Compte bloqué"}
          </CardTitle>
          <CardDescription>
            {isPending
              ? "Un administrateur doit valider ton compte avant que tu puisses accéder à l'app."
              : "Ton compte a été bloqué par un administrateur."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => logoutMutation.mutate()}
          >
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </CenteredPage>
  )
}
