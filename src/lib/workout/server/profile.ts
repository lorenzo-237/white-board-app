import { createServerFn } from "@tanstack/react-start"

import { prisma } from "@/db"
import {
  getSessionDaysRemaining,
  renewCurrentSession,
  requireUserId,
} from "@/lib/auth/session"

export interface ProfileStats {
  daysRemaining: number
  totalSessions: number
  sessionsLast30Days: number
  lastSessionDate: string | null
}

export const getProfileStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProfileStats> => {
    const userId = await requireUserId()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [daysRemaining, totalSessions, sessionsLast30Days, lastSession] =
      await Promise.all([
        getSessionDaysRemaining(),
        prisma.workoutSession.count({ where: { userId } }),
        prisma.workoutSession.count({
          where: { userId, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.workoutSession.findFirst({
          where: { userId },
          orderBy: { date: "desc" },
          select: { date: true },
        }),
      ])

    return {
      daysRemaining: daysRemaining ?? 0,
      totalSessions,
      sessionsLast30Days,
      lastSessionDate: lastSession
        ? lastSession.date.toISOString().slice(0, 10)
        : null,
    }
  }
)

export const renewSession = createServerFn({ method: "POST" }).handler(
  async () => {
    await renewCurrentSession()
  }
)
