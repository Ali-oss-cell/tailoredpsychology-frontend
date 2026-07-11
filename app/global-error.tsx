"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md space-y-4 rounded-xl border border-border/70 bg-card p-6 shadow-e2">
          <h1 className="font-heading text-xl font-semibold">Unexpected error</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Something went wrong while loading Tailored Psychology. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
