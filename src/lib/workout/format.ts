import type { WorkoutItem } from "@/lib/workout/types"

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
  const base = `${item.sets} séries × ${item.reps} ${unit}`
  return item.weight ? `${base} · ${item.weight} kg` : base
}
