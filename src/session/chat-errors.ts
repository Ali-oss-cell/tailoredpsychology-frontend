export class ChatAccessError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ChatAccessError"
    this.status = status
  }
}

export function isChatAccessError(error: unknown): error is ChatAccessError {
  return error instanceof ChatAccessError
}

export function chatAccessMessage(status: number): string {
  if (status === 403) {
    return "You don't have access to this appointment's chat. Log in as the assigned patient or psychologist for this session."
  }
  if (status === 404) {
    return "This appointment chat was not found. It may have been removed or the test session may need to be re-seeded on the server."
  }
  return "Could not load chat for this appointment."
}
