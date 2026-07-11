import { render, screen } from "@testing-library/react"

import { PortalFormField, PortalTextInput } from "@/components/shared/portal-form-field"

describe("PortalFormField", () => {
  it("propagates required to child input", () => {
    render(
      <PortalFormField id="test-field" label="Email" required>
        <PortalTextInput />
      </PortalFormField>,
    )

    const input = screen.getByRole("textbox")
    expect(input).toBeRequired()
    expect(input).toHaveAttribute("aria-required", "true")
  })

  it("links hint and error via aria-describedby", () => {
    render(
      <PortalFormField id="test-field" label="Notes" hint="Optional" error="Required">
        <PortalTextInput />
      </PortalFormField>,
    )

    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("aria-describedby", "test-field-hint test-field-error")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })
})
