"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as React from "react"

import { isTransientNetworkError } from "@/src/lib/network-error"

function queryRetry(failureCount: number, error: unknown): boolean {
  return isTransientNetworkError(error) && failureCount < 3
}

function queryRetryDelay(attemptIndex: number): number {
  return Math.min(1_000 * 2 ** attemptIndex, 30_000)
}

export function QueryClientProviderWrapper({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: queryRetry,
            retryDelay: queryRetryDelay,
          },
        },
      }),
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
