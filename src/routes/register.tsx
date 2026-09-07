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
import { getCurrentUser, register } from "@/lib/auth/server"

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (user)
      throw redirect({ to: user.status === "ACTIVE" ? "/" : "/account-status" })
  },
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const registerMutation = useMutation({
    mutationFn: () => register({ data: { name, email, password } }),
    onSuccess: () => navigate({ to: "/" }),
  })

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    registerMutation.mutate()
  }

  return (
    <CenteredPage>
      <Card>
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>
            Ton compte devra être validé par un administrateur avant que tu
            puisses accéder à l'app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nom</FieldLabel>
                <Input
                  id="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
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
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>
              {registerMutation.isError && (
                <FieldError>{registerMutation.error.message}</FieldError>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? "Création..."
                  : "Créer mon compte"}
              </Button>
            </FieldGroup>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </CenteredPage>
  )
}
