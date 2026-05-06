import { tutorialsEnabled } from "@/src/tutorials/flags"

describe("tutorialsEnabled", () => {
  const prev = process.env.NEXT_PUBLIC_TUTORIALS

  afterEach(() => {
    if (prev === undefined) {
      Reflect.deleteProperty(process.env, "NEXT_PUBLIC_TUTORIALS")
    } else {
      process.env.NEXT_PUBLIC_TUTORIALS = prev
    }
  })

  it("is off when NEXT_PUBLIC_TUTORIALS is 0", () => {
    process.env.NEXT_PUBLIC_TUTORIALS = "0"
    expect(tutorialsEnabled()).toBe(false)
  })

  it("is on when NEXT_PUBLIC_TUTORIALS is 1", () => {
    process.env.NEXT_PUBLIC_TUTORIALS = "1"
    expect(tutorialsEnabled()).toBe(true)
  })

  it("matches NODE_ENV when the var is unset", () => {
    Reflect.deleteProperty(process.env, "NEXT_PUBLIC_TUTORIALS")
    expect(tutorialsEnabled()).toBe(process.env.NODE_ENV === "development")
  })
})
