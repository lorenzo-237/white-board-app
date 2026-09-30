import * as React from "react"
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"

import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "White Board",
        },
        // Single entry: HeadContent dedupes metas by name, so a light/dark
        // pair via `media` would silently lose one of them.
        { name: "theme-color", content: "#ffffff" },
        // iOS ignores most of the manifest and relies on these instead.
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-title", content: "WB" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "default",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "manifest", href: "/manifest.json" },
        { rel: "icon", href: "/assets/icon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png" },
      ],
    }),
    notFoundComponent: () => (
      <main className="container mx-auto p-4 pt-16">
        <h1>404</h1>
        <p>The requested page could not be found.</p>
      </main>
    ),
    shellComponent: RootDocument,
  }
)

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()

  React.useEffect(() => {
    // Dev is skipped so a stale service worker never masks Vite's HMR.
    if (import.meta.env.DEV || !("serviceWorker" in navigator)) return
    navigator.serviceWorker.register("/sw.js").catch(() => {})
  }, [])

  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
