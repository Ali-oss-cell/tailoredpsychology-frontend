/** Best-effort NestJS / validation error message from a failed fetch response body. */
export async function parseHttpErrorMessage(response: Response): Promise<string | undefined> {
  try {
    const data = (await response.clone().json()) as { message?: string | string[] }
    if (typeof data.message === "string") return data.message
    if (Array.isArray(data.message)) return data.message.filter(Boolean).join(" ")
  } catch {
    // ignore non-JSON or empty body
  }
  return undefined
}
