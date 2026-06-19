import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, type RenderOptions } from "@testing-library/react"

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  })
}

export function renderWithQueryClient(ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  const queryClient = createTestQueryClient()
  return {
    queryClient,
    ...render(ui, {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      ...options,
    }),
  }
}
