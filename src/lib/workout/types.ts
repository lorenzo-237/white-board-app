/** An exercise's muscle-group category. "commun" exercises are usable in any template. */
export type Category = "commun" | "haut" | "bas" | "abdo" | "dos"

export type RepsType = "reps" | "sec"

export interface Exercise {
  id: string
  name: string
  category: Category
}

/** One step of a "gamme montante" (ascending sets): its own reps and optional load. */
export interface AscendingStep {
  reps: number
  weight: string
}

export interface WorkoutItem {
  id: string
  exerciseId: string
  name: string
  /** Snapshot of the exercise's category at the time it was added. */
  category: Category
  sets: number
  reps: number
  repsType: RepsType
  /** Optional load, kept as free text so the field can stay empty. */
  weight: string
  /** Short free-text instructions for this exercise (empty when none). */
  description: string
  /**
   * When set (non-empty), the item is a "gamme montante": each set has its
   * own reps/weight and `sets`/`reps`/`weight` above are ignored.
   */
  ascendingSets: Array<AscendingStep> | null
}

export interface Template {
  id: string
  name: string
  items: Array<WorkoutItem>
}

export interface WorkoutSession {
  id: string
  templateId: string
  templateName: string
  /** ISO date (yyyy-mm-dd), matches an <input type="date"> value. */
  date: string
  items: Array<WorkoutItem>
}

/** A session that has been started but not finished yet (no id until saved). */
export type ActiveSession = Omit<WorkoutSession, "id">
