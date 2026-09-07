import { createServerFn } from "@tanstack/react-start"

import { prisma } from "@/db"
import { requireUserId } from "@/lib/auth/session"
import {
  toItemCreateInput,
  toTemplateCategory,
  toWorkoutItem,
} from "@/lib/workout/server/mappers"
import type { Template } from "@/lib/workout/types"

const templateWithItems = { items: { orderBy: { position: "asc" as const } } }

function toTemplate(row: {
  id: string
  name: string
  category: string
  items: Array<Parameters<typeof toWorkoutItem>[0]>
}): Template {
  return {
    id: row.id,
    name: row.name,
    category: toTemplateCategory(row.category),
    items: row.items.map(toWorkoutItem),
  }
}

export const listTemplates = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<Template>> => {
    const userId = await requireUserId()
    const templates = await prisma.template.findMany({
      where: { userId },
      include: templateWithItems,
      orderBy: { createdAt: "asc" },
    })
    return templates.map(toTemplate)
  }
)

export const saveTemplate = createServerFn({ method: "POST" })
  .validator((data: Template) => data)
  .handler(async ({ data }): Promise<Template> => {
    const userId = await requireUserId()
    const saved = await prisma.$transaction(async (tx) => {
      const existing = await tx.template.findUnique({
        where: { id: data.id },
        select: { userId: true },
      })
      if (existing && existing.userId !== userId) {
        throw new Error("Forbidden")
      }
      await tx.template.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          name: data.name,
          category: data.category,
          userId,
        },
        update: { name: data.name, category: data.category },
      })
      await tx.templateItem.deleteMany({ where: { templateId: data.id } })
      if (data.items.length > 0) {
        await tx.templateItem.createMany({
          data: data.items.map((item, index) => ({
            ...toItemCreateInput(item, index),
            templateId: data.id,
          })),
        })
      }
      return tx.template.findUniqueOrThrow({
        where: { id: data.id },
        include: templateWithItems,
      })
    })
    return toTemplate(saved)
  })

export const deleteTemplate = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    await prisma.template.deleteMany({ where: { id: data.id, userId } })
  })
