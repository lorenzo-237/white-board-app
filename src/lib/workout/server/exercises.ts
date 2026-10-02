import { createServerFn } from "@tanstack/react-start"

import { prisma } from "@/db"
import { requireUserId } from "@/lib/auth/session"
import type { Category, Exercise } from "@/lib/workout/types"

export const listExercises = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<Exercise>> => {
    await requireUserId()
    const exercises = await prisma.exercise.findMany()
    // Sorted in JS rather than by Postgres so accents and case follow French
    // alphabetical order regardless of the database collation.
    return exercises
      .map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
      )
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

/**
 * Renames an exercise and the template items that use it, so templates keep
 * showing the current name. Finished sessions are history and keep their
 * snapshot.
 */
export const renameExercise = createServerFn({ method: "POST" })
  .validator((data: { id: string; name: string }) => data)
  .handler(async ({ data }) => {
    await requireUserId()
    const name = data.name.trim()
    if (!name) throw new Error("Le nom de l'exercice est obligatoire")
    await prisma.$transaction([
      prisma.exercise.update({ where: { id: data.id }, data: { name } }),
      prisma.templateItem.updateMany({
        where: { exerciseId: data.id },
        data: { name },
      }),
    ])
  })

export const deleteExercise = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireUserId()
    await prisma.exercise.delete({ where: { id: data.id } })
  })
