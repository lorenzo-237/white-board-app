import {
  ClipboardIcon,
  DumbbellIcon,
  HistoryIcon,
  PlayCircleIcon,
} from "@hugeicons/core-free-icons"

export const NAV_ITEMS = [
  { to: "/exercises", label: "Exercices", icon: DumbbellIcon },
  { to: "/templates", label: "Templates", icon: ClipboardIcon },
  { to: "/session", label: "Séance", icon: PlayCircleIcon },
  { to: "/history", label: "Historique", icon: HistoryIcon },
] as const

/** Pages reachable only from the burger menu, not the bottom tab bar. */
export const EXTRA_PAGE_TITLES = {
  "/profile": "Profil",
  "/admin/users": "Administration",
} as const
