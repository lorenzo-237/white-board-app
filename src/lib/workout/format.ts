import { EXERCISE_CATEGORIES } from "@/lib/workout/constants"
import type { Category, WorkoutItem } from "@/lib/workout/types"

export function createId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatSessionDate(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

export function pluralize(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

export function formatItemSummary(item: WorkoutItem): string {
  const unit = item.repsType === "sec" ? "sec" : "reps"
  if (item.ascendingSets && item.ascendingSets.length > 0) {
    return item.ascendingSets
      .map(
        (step) =>
          `${step.reps} ${unit}${step.weight ? ` (${step.weight} kg)` : ""}`
      )
      .join(" · ")
  }
  const base = `${item.sets} séries × ${item.reps} ${unit}`
  return item.weight ? `${base} · ${item.weight} kg` : base
}

/**
 * A template/session has no category of its own - it's derived from the
 * categories of its items. "commun" is a lambda category so it's dropped
 * whenever at least one more specific category is present.
 */
export function getItemCategories(items: Array<WorkoutItem>): Array<Category> {
  const distinct = new Set(items.map((item) => item.category))
  const meaningful = EXERCISE_CATEGORIES.filter(
    (category) => category !== "commun" && distinct.has(category)
  )
  if (meaningful.length > 0) return meaningful
  return distinct.has("commun") ? ["commun"] : []
}
