import {
  clearSession,
  getSession,
  useSession,
} from "@tanstack/react-start/server"

interface AuthSessionData {
  userId: string
}

const SESSION_NAME = "auth"
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

function sessionConfig() {
  const password = process.env.SESSION_SECRET
  if (!password) {
    throw new Error("SESSION_SECRET is not set")
  }
  return { password, name: SESSION_NAME, maxAge: SESSION_MAX_AGE_SECONDS }
}

export async function getSessionUserId(): Promise<string | null> {
  const session = await getSession<AuthSessionData>(sessionConfig())
  return session.data.userId ?? null
}

export async function requireUserId(): Promise<string> {
  const userId = await getSessionUserId()
  if (!userId) {
    throw new Error("Unauthorized")
  }
  return userId
}

/** Seals a fresh cookie for this user - also used to slide the 30-day expiry forward. */
export async function createUserSession(userId: string): Promise<void> {
  const session = await useSession<AuthSessionData>(sessionConfig())
  await session.update({ userId })
}

export async function renewCurrentSession(): Promise<void> {
  const userId = await requireUserId()
  await createUserSession(userId)
}

export async function clearUserSession(): Promise<void> {
  await clearSession(sessionConfig())
}

/** Days left before the session cookie expires and a real re-login is required. */
export async function getSessionDaysRemaining(): Promise<number | null> {
  const session = await getSession<AuthSessionData>(sessionConfig())
  if (!session.data.userId) return null
  const expiresAt = session.createdAt + SESSION_MAX_AGE_SECONDS * 1000
  return Math.max(
    0,
    Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000))
  )
}
