export type UserRole = "ADMIN" | "USER"

export type UserStatus = "PENDING" | "ACTIVE" | "BLOCKED"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  createdAt: string
}
