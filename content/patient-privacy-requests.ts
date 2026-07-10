export const patientPrivacyRequestsContent = {
  header: {
    title: "Your records & privacy",
    description:
      "Need a copy of your information, or spotted something that needs updating? Start a request here — we'll keep you posted.",
  },
  newRequest: {
    title: "What do you need help with?",
    intro:
      "We handle these requests carefully under Australian privacy law. Under the Australian Privacy Principles, we aim to respond within 30 days. Choose an option below and tell us a bit more — we'll reach out if we need anything else.",
    access: {
      label: "Get a copy of my records",
      hint: "Request the health information we hold about you.",
    },
    correction: {
      label: "Fix something in my details",
      hint: "Update your name, contact details, or other information on file.",
    },
  },
  list: {
    title: "Your requests",
    loading: "Loading your requests…",
    empty: "You haven't submitted a request yet. Use the options above when you're ready.",
    error: "We couldn't load your requests. Please try again.",
    submitError: "We couldn't send your request. Please try again.",
  },
  dialog: {
    access: {
      title: "Get a copy of your records",
      description: "Tell us what you need — for example, session notes, invoices, or your full patient file.",
      placeholder: "e.g. I'd like a copy of my session notes from the past 12 months.",
      fieldLabel: "What would you like us to send you?",
    },
    correction: {
      title: "Fix something in my details",
      description: "Describe what's wrong and what it should say instead. We'll review and get back to you.",
      placeholder: "e.g. My mobile number has changed to 04XX XXX XXX.",
      fieldLabel: "What needs to be updated?",
    },
    confirmLabel: "Send request",
  },
  requestTypeLabel: {
    access: "Copy of my records",
    correction: "Fix my details",
  } as const,
  statusLabel: {
    submitted: "Submitted — we're reviewing it",
    in_review: "In review",
    completed: "Completed",
    rejected: "Couldn't be completed",
  } as Record<string, string>,
}

export function formatPrivacyRequestStatus(status: string): string {
  return (
    patientPrivacyRequestsContent.statusLabel[status] ??
    status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

export function formatPrivacyRequestDue(slaDueAt: string): string {
  const due = new Date(slaDueAt)
  if (Number.isNaN(due.getTime())) return "We'll update you soon"
  return `Expected update by ${due.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })}`
}
