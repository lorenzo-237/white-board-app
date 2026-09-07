import { createServerFn } from "@tanstack/react-start"

import { prisma } from "@/db"
import { requireUserId } from "@/lib/auth/session"
import type { AuthUser, UserStatus } from "@/lib/auth/types"

export type AdminUser = AuthUser

async function requireAdmin(): Promise<string> {
  const userId = await requireUserId()
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden")
  }
  return userId
}

export const listUsers = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<AdminUser>> => {
    await requireAdmin()
    const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } })
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    }))
  }
)

export const setUserStatus = createServerFn({ method: "POST" })
  .validator((data: { userId: string; status: UserStatus }) => data)
  .handler(async ({ data }) => {
    const adminId = await requireAdmin()
    if (data.userId === adminId) {
      throw new Error("Tu ne peux pas changer ton propre statut")
    }
    await prisma.user.update({
      where: { id: data.userId },
      data: { status: data.status },
    })
  })
