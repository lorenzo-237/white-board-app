import { createFileRoute, redirect } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { AdminUserCard } from "@/components/admin/admin-user-card"
import { listUsers, setUserStatus } from "@/lib/admin/server"
import type { UserStatus } from "@/lib/auth/types"

export const Route = createFileRoute("/_app/admin/users")({
  beforeLoad: ({ context }) => {
    if (context.user.role !== "ADMIN") throw redirect({ to: "/" })
  },
  component: AdminUsersPage,
})

const USERS_QUERY_KEY = ["admin", "users"] as const

function AdminUsersPage() {
  const { user: currentUser } = Route.useRouteContext()
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => listUsers(),
  })

  const setStatusMutation = useMutation({
    mutationFn: (input: { userId: string; status: UserStatus }) =>
      setUserStatus({ data: input }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  })

  const users = usersQuery.data ?? []

  return (
    <div className="flex flex-col gap-2.5">
      {users.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">Aucun utilisateur</p>
      ) : (
        users.map((user) => (
          <AdminUserCard
            key={user.id}
            user={user}
            disabled={user.id === currentUser.id || setStatusMutation.isPending}
            onSetStatus={(status) =>
              setStatusMutation.mutate({ userId: user.id, status })
            }
          />
        ))
      )}
    </div>
  )
}
