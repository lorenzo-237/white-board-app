import type { TemplateCategory, WorkoutItem } from "@/lib/workout/types"

interface ItemRow {
  id: string
  exerciseId: string
  name: string
  sets: number
  reps: number
  repsType: string
  weight: string
}

export function toWorkoutItem(row: ItemRow): WorkoutItem {
  return {
    id: row.id,
    exerciseId: row.exerciseId,
    name: row.name,
    sets: row.sets,
    reps: row.reps,
    repsType: row.repsType as WorkoutItem["repsType"],
    weight: row.weight,
  }
}

export function toItemCreateInput(item: WorkoutItem, position: number) {
  return {
    id: item.id,
    position,
    exerciseId: item.exerciseId,
    name: item.name,
    sets: item.sets,
    reps: item.reps,
    repsType: item.repsType,
    weight: item.weight,
  }
}

export function toTemplateCategory(value: string): TemplateCategory {
  return value as TemplateCategory
}
