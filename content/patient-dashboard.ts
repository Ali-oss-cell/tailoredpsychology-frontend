export const patientDashboardContent = {
  greeting: {
    title: "Hello, Sarah",
    description: "Here's your health journey overview and what's next.",
  },
  quickActions: [
    { title: "Book appointment", subtitle: "Schedule your next session", icon: "book" as const },
    { title: "Message clinic", subtitle: "Open secure chat", icon: "message" as const },
    { title: "View invoices", subtitle: "Billing and receipts", icon: "invoice" as const },
  ],
  resources: [
    {
      title: "Morning Grounding Exercise",
      meta: "Guided audio • 10 min",
      description: "Start your day with intention and calm using this brief mindfulness practice.",
      imageSrc: "/assets/resource-library.svg",
    },
    {
      title: "Cognitive Defusion Techniques",
      meta: "Article • 5 min read",
      description: "Learn to step back from unhelpful thoughts rather than getting tangled in them.",
      imageSrc: "/assets/team-discussion.svg",
    },
  ],
}
