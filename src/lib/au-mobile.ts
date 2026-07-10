/** Plain-language validation copy shared across booking and account forms. */
export const AU_MOBILE_HINT = "Australian mobile, e.g. 04XX XXX XXX"
export const AU_MOBILE_INVALID_MESSAGE = "Enter a valid Australian mobile (04XX XXX XXX)."

/** Strip formatting and normalise +61 / 4xxxxxxxx to 04xxxxxxxx. */
export function normalizeAuMobile(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ""

  let digits = trimmed.replace(/[\s\-().]/g, "")
  if (digits.startsWith("+61")) {
    digits = `0${digits.slice(3)}`
  } else if (digits.startsWith("61") && digits.length >= 11) {
    digits = `0${digits.slice(2)}`
  } else if (digits.startsWith("4") && digits.length === 9) {
    digits = `0${digits}`
  }

  return digits
}

export function isValidAuMobile(input: string): boolean {
  return /^04\d{8}$/.test(normalizeAuMobile(input))
}

/** Display helper for 04xx xxx xxx when normalised input is valid. */
export function formatAuMobileDisplay(input: string): string {
  const normalized = normalizeAuMobile(input)
  if (!/^04\d{8}$/.test(normalized)) {
    return input.trim()
  }
  return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`
}
