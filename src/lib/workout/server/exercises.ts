import { createServerFn } from "@tanstack/react-start"

import { prisma } from "@/db"
import { requireUserId } from "@/lib/auth/session"
import type { Category, Exercise } from "@/lib/workout/types"

export const listExercises = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<Exercise>> => {
    await requireUserId()
    const exercises = await prisma.exercise.findMany({
      orderBy: { createdAt: "asc" },
    })
    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      category: exercise.category,
    }))
  }
)

export const createExercise = createServerFn({ method: "POST" })
  .validator((data: { name: string; category: Category }) => data)
  .handler(async ({ data }): Promise<Exercise> => {
    await requireUserId()
    const exercise = await prisma.exercise.create({
      data: { name: data.name, category: data.category },
    })
    return { id: exercise.id, name: exercise.name, category: exercise.category }
  })

export const deleteExercise = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireUserId()
    await prisma.exercise.delete({ where: { id: data.id } })
  })
