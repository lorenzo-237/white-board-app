import type { Prisma } from "@/generated/prisma/client"
import type { AscendingStep, WorkoutItem } from "@/lib/workout/types"

interface ItemRow {
  id: string
  exerciseId: string
  name: string
  category: string
  sets: number
  reps: number
  repsType: string
  weight: string
  description: string
  ascendingSets: unknown
}

function toAscendingSets(value: unknown): Array<AscendingStep> | null {
  if (!Array.isArray(value) || value.length === 0) return null
  return value as Array<AscendingStep>
}

export function toWorkoutItem(row: ItemRow): WorkoutItem {
  return {
    id: row.id,
    exerciseId: row.exerciseId,
    name: row.name,
    category: row.category as WorkoutItem["category"],
    sets: row.sets,
    reps: row.reps,
    repsType: row.repsType as WorkoutItem["repsType"],
    weight: row.weight,
    description: row.description,
    ascendingSets: toAscendingSets(row.ascendingSets),
  }
}

export function toItemCreateInput(item: WorkoutItem, position: number) {
  return {
    id: item.id,
    position,
    exerciseId: item.exerciseId,
    name: item.name,
    category: item.category,
    sets: item.sets,
    reps: item.reps,
    repsType: item.repsType,
    weight: item.weight,
    // `??` covers active sessions persisted client-side before this field existed.
    description: item.description ?? "",
    ascendingSets: item.ascendingSets
      ? (item.ascendingSets as unknown as Prisma.InputJsonValue)
      : undefined,
  }
}
