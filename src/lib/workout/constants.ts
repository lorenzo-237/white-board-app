import type { Category, TemplateCategory } from "@/lib/workout/types"

export const CATEGORY_LABELS: Record<Category, string> = {
  commun: "Commun",
  haut: "Haut du corps",
  bas: "Bas du corps",
}

export const EXERCISE_CATEGORIES: Array<Category> = ["commun", "haut", "bas"]
export const TEMPLATE_CATEGORIES: Array<TemplateCategory> = ["haut", "bas"]

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
}

export const WORKOUT_STORAGE_KEY = "gym-tracker-v1"
