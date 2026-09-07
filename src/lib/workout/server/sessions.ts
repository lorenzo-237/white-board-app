import { createServerFn } from "@tanstack/react-start"

import { prisma } from "@/db"
import { requireUserId } from "@/lib/auth/session"
import {
  toItemCreateInput,
  toTemplateCategory,
  toWorkoutItem,
} from "@/lib/workout/server/mappers"
import type { ActiveSession, WorkoutSession } from "@/lib/workout/types"

const sessionWithItems = { items: { orderBy: { position: "asc" as const } } }

function toWorkoutSession(row: {
  id: string
  templateId: string | null
  templateName: string
  category: string
  date: Date
  items: Array<Parameters<typeof toWorkoutItem>[0]>
}): WorkoutSession {
  return {
    id: row.id,
    templateId: row.templateId ?? "",
    templateName: row.templateName,
    category: toTemplateCategory(row.category),
    date: row.date.toISOString().slice(0, 10),
    items: row.items.map(toWorkoutItem),
  }
}

export const listSessions = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<WorkoutSession>> => {
    const userId = await requireUserId()
    const sessions = await prisma.workoutSession.findMany({
      where: { userId },
      include: sessionWithItems,
      orderBy: { createdAt: "desc" },
    })
    return sessions.map(toWorkoutSession)
  }
)

export const createSession = createServerFn({ method: "POST" })
  .validator((data: ActiveSession) => data)
  .handler(async ({ data }): Promise<WorkoutSession> => {
    const userId = await requireUserId()
    const created = await prisma.workoutSession.create({
      data: {
        userId,
        templateId: data.templateId || null,
        templateName: data.templateName,
        category: data.category,
        date: new Date(`${data.date}T00:00:00.000Z`),
        items: {
          create: data.items.map((item, index) =>
            toItemCreateInput(item, index)
          ),
        },
      },
      include: sessionWithItems,
    })
    return toWorkoutSession(created)
  })

export const deleteSession = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    await prisma.workoutSession.deleteMany({ where: { id: data.id, userId } })
  })
