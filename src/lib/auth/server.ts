import { createServerFn } from "@tanstack/react-start"

import { prisma } from "@/db"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import {
  clearUserSession,
  createUserSession,
  getSessionUserId,
} from "@/lib/auth/session"
import type { AuthUser } from "@/lib/auth/types"

function toAuthUser(user: {
  id: string
  email: string
  name: string
  role: string
  status: string
  createdAt: Date
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as AuthUser["role"],
    status: user.status as AuthUser["status"],
    createdAt: user.createdAt.toISOString(),
  }
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthUser | null> => {
    const userId = await getSessionUserId()
    if (!userId) return null
    const user = await prisma.user.findUnique({ where: { id: userId } })
    return user ? toAuthUser(user) : null
  }
)

export const login = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }): Promise<AuthUser> => {
    const email = data.email.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      throw new Error("Email ou mot de passe incorrect")
    }
    await createUserSession(user.id)
    return toAuthUser(user)
  })

export const register = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string; name: string }) => data)
  .handler(async ({ data }): Promise<AuthUser> => {
    const email = data.email.trim().toLowerCase()
    const name = data.name.trim()
    if (!email || !name || data.password.length < 8) {
      throw new Error(
        "Nom, email et mot de passe (8 caractères minimum) sont requis"
      )
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new Error("Cet email est déjà utilisé")
    }
    const passwordHash = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
    })
    await createUserSession(user.id)
    return toAuthUser(user)
  })

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await clearUserSession()
})
