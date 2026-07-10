import { render, screen, within } from "@testing-library/react"

import { PublicHeaderNav } from "@/components/layout/public-header-nav"

const mockPathname = jest.fn(() => "/pricing")

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}))

describe("PublicHeaderNav", () => {
  it("marks the active route with aria-current", () => {
    mockPathname.mockReturnValue("/pricing")
    render(<PublicHeaderNav />)
    const nav = screen.getByRole("navigation", { name: /primary/i })
    const pricing = within(nav).getByRole("link", { name: "Pricing" })
    expect(pricing).toHaveAttribute("aria-current", "page")
    expect(within(nav).getByRole("button", { name: /services/i })).not.toHaveAttribute("aria-current")
  })

  it("treats condition detail routes as Conditions active", () => {
    mockPathname.mockReturnValue("/conditions/anxiety")
    render(<PublicHeaderNav />)
    const nav = screen.getByRole("navigation", { name: /primary/i })
    expect(within(nav).getByRole("link", { name: "Conditions" })).toHaveAttribute("aria-current", "page")
  })
})
