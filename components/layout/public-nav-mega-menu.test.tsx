import { fireEvent, render, screen } from "@testing-library/react"

import { PublicNavMegaMenuDropdown } from "@/components/layout/public-nav-mega-menu"
import { PUBLIC_NAV_MEGA_MENUS } from "@/content/public-nav"

jest.mock("next/navigation", () => ({
  usePathname: () => "/pricing",
}))

describe("PublicNavMegaMenuDropdown chevron", () => {
  it.each([
    ["Services", PUBLIC_NAV_MEGA_MENUS.services],
    ["Resources", PUBLIC_NAV_MEGA_MENUS.resources],
  ] as const)("uses down chevron when closed and up chevron when open (%s)", (_label, menu) => {
    render(<PublicNavMegaMenuDropdown menu={menu} pathname="/pricing" />)
    const button = screen.getByRole("button", { name: menu.label })
    const wrapper = button.parentElement!

    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByTestId(`nav-mega-chevron-${menu.id}-closed`)).toBeInTheDocument()
    expect(screen.queryByTestId(`nav-mega-chevron-${menu.id}-open`)).not.toBeInTheDocument()

    fireEvent.mouseEnter(wrapper)
    expect(button).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByTestId(`nav-mega-chevron-${menu.id}-open`)).toBeInTheDocument()
    expect(screen.queryByTestId(`nav-mega-chevron-${menu.id}-closed`)).not.toBeInTheDocument()

    fireEvent.mouseLeave(wrapper)
    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByTestId(`nav-mega-chevron-${menu.id}-closed`)).toBeInTheDocument()
    expect(screen.queryByTestId(`nav-mega-chevron-${menu.id}-open`)).not.toBeInTheDocument()
  })

  it("does not show up chevron when mega menu is active but closed", () => {
    render(<PublicNavMegaMenuDropdown menu={PUBLIC_NAV_MEGA_MENUS.resources} pathname="/resources" />)

    expect(screen.getByRole("button", { name: "Resources" })).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByTestId("nav-mega-chevron-resources-closed")).toBeInTheDocument()
    expect(screen.queryByTestId("nav-mega-chevron-resources-open")).not.toBeInTheDocument()
  })
})
