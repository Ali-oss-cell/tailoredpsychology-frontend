import { getConditionBySlug } from "@/content/conditions"

describe("conditions content", () => {
  it("resolves valid slug", () => {
    const condition = getConditionBySlug("anxiety")
    expect(condition?.title).toContain("Anxiety")
  })

  it("returns undefined for invalid slug", () => {
    expect(getConditionBySlug("not-a-real-condition")).toBeUndefined()
  })
})
