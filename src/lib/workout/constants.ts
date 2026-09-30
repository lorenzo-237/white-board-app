import type { Category } from "@/lib/workout/types"

export const CATEGORY_LABELS: Record<Category, string> = {
  commun: "Commun",
  haut: "Haut du corps",
  bas: "Bas du corps",
  abdo: "Abdos",
  dos: "Dos",
}

export const EXERCISE_CATEGORIES: Array<Category> = [
  "commun",
  "haut",
  "bas",
  "abdo",
  "dos",
]

/** Tailwind color tokens per category, kept in one place so every component stays in sync. */
export const CATEGORY_COLORS: Record<
  Category,
  { text: string; border: string; solidBg: string; solidText: string }
> = {
  commun: {
    text: "text-muted-foreground",
    border: "border-muted-foreground/40",
    solidBg: "bg-muted-foreground",
    solidText: "text-background",
  },
  haut: {
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-600 dark:border-blue-400",
    solidBg: "bg-blue-600 dark:bg-blue-500",
    solidText: "text-white",
  },
  bas: {
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-600 dark:border-emerald-400",
    solidBg: "bg-emerald-600 dark:bg-emerald-500",
    solidText: "text-white",
  },
  abdo: {
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-600 dark:border-amber-400",
    solidBg: "bg-amber-600 dark:bg-amber-500",
    solidText: "text-white",
  },
  dos: {
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-600 dark:border-violet-400",
    solidBg: "bg-violet-600 dark:bg-violet-500",
    solidText: "text-white",
  },
}

export const WORKOUT_STORAGE_KEY = "gym-tracker-v1"
