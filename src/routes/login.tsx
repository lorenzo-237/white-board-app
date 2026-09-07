import * as React from "react"
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getCurrentUser, login } from "@/lib/auth/server"

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (user)
      throw redirect({ to: user.status === "ACTIVE" ? "/" : "/account-status" })
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const loginMutation = useMutation({
    mutationFn: () => login({ data: { email, password } }),
    onSuccess: () => navigate({ to: "/" }),
  })

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    loginMutation.mutate()
  }

  return (
    <CenteredPage>
      <Card>
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Accède à ton suivi d'entraînement.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>
              {loginMutation.isError && (
                <FieldError>{loginMutation.error.message}</FieldError>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Connexion..." : "Se connecter"}
              </Button>
            </FieldGroup>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-primary underline-offset-4 hover:underline"
            >
              S'inscrire
            </Link>
          </p>
        </CardContent>
      </Card>
    </CenteredPage>
  )
}
