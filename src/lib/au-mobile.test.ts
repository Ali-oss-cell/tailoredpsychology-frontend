import {
  formatAuMobileDisplay,
  isValidAuMobile,
  normalizeAuMobile,
} from "@/src/lib/au-mobile"

describe("au-mobile", () => {
  it("normalises common Australian mobile formats", () => {
    expect(normalizeAuMobile("0412 345 678")).toBe("0412345678")
    expect(normalizeAuMobile("+61 412 345 678")).toBe("0412345678")
    expect(normalizeAuMobile("61412345678")).toBe("0412345678")
    expect(normalizeAuMobile("412345678")).toBe("0412345678")
  })

  it("validates 04xx numbers", () => {
    expect(isValidAuMobile("0412345678")).toBe(true)
    expect(isValidAuMobile("+61 412 345 678")).toBe(true)
    expect(isValidAuMobile("0312345678")).toBe(false)
    expect(isValidAuMobile("")).toBe(false)
  })

  it("formats display spacing", () => {
    expect(formatAuMobileDisplay("0412345678")).toBe("0412 345 678")
    expect(formatAuMobileDisplay("invalid")).toBe("invalid")
  })
})
