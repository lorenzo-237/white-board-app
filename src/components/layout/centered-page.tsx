export function CenteredPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
