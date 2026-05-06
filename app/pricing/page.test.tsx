import { render, screen } from "@testing-library/react"

import PricingPage from "@/app/pricing/page"

jest.mock("@/components/layout/public-header", () => ({
  PublicHeader: () => <div>Header</div>,
}))
jest.mock("@/components/layout/public-footer", () => ({
  PublicFooter: () => <div>Footer</div>,
}))
describe("PricingPage", () => {
  it("renders pricing and Medicare examples", () => {
    render(<PricingPage />)
    expect(screen.getByText("Transparent pricing in one place")).toBeInTheDocument()
    expect(screen.getByText("Medicare gap examples")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Get matched" })).toBeInTheDocument()
  })
})
