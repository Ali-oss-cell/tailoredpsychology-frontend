"use client"

import * as React from "react"

/** Read `?q=` (or custom param) on mount without requiring a Suspense boundary. */
export function useUrlSearchQuery(param = "q"): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setValue(params.get(param) ?? "")
  }, [param])

  return [value, setValue]
}
