/** An exercise's muscle-group category. "commun" exercises are usable in any template. */
export type Category = "commun" | "haut" | "bas"

/** Categories a template (and therefore a session) can belong to. */
export type TemplateCategory = "haut" | "bas"

export type RepsType = "reps" | "sec"

export interface Exercise {
  id: string
  name: string
  category: Category
}

export interface WorkoutItem {
  id: string
  exerciseId: string
  name: string
  sets: number
  reps: number
  repsType: RepsType
  /** Optional load, kept as free text so the field can stay empty. */
  weight: string
}

export interface Template {
  id: string
  name: string
  category: TemplateCategory
  items: Array<WorkoutItem>
}

export interface WorkoutSession {
  id: string
  templateId: string
  templateName: string
  category: TemplateCategory
  /** ISO date (yyyy-mm-dd), matches an <input type="date"> value. */
  date: string
  items: Array<WorkoutItem>
}

/** A session that has been started but not finished yet (no id until saved). */
export type ActiveSession = Omit<WorkoutSession, "id">
