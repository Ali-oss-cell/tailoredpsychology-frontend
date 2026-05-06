export const psychologistDashboardContent = {
  greeting: {
    title: "Good afternoon, Dr. Chen",
    description:
      "Here is your clinical operations snapshot for today: sessions, patients, and notes in one place.",
  },
  overview: [
    { label: "Sessions today", value: "6" },
    { label: "Patients seen", value: "4" },
    { label: "Pending notes", value: "3" },
    { label: "Next session", value: "2:30 PM" },
  ],
  operations: [
    {
      title: "Join telehealth room",
      subtitle: "Start next scheduled session",
      href: "/psychologist/schedule",
    },
    {
      title: "Open notes workspace",
      subtitle: "Continue progress note drafting",
      href: "/psychologist/notes",
    },
    {
      title: "Review patient queue",
      subtitle: "Prioritize follow-up actions",
      href: "/psychologist/patients",
    },
  ],
  schedule: [
    { time: "9:00 AM", patient: "Liam M.", type: "Follow-up consultation" },
    { time: "10:30 AM", patient: "Olivia R.", type: "Initial assessment" },
    { time: "2:30 PM", patient: "Noah K.", type: "Telehealth session" },
    { time: "4:00 PM", patient: "Amelia P.", type: "Progress review" },
  ],
  notes: {
    pendingCount: 3,
    signedCount: 5,
  },
}
