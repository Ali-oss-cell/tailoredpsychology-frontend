export const patientAppointmentsContent = {
  header: {
    title: "My Appointments",
    description: "Track upcoming sessions, review past appointments, and manage schedule changes.",
  },
  upcoming: [
    {
      clinician: "Dr. Emily Chen",
      type: "Clinical Psychology Consultation",
      date: "Oct 24, 2026",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      clinician: "Dr. Emily Chen",
      type: "Follow-up Session",
      date: "Nov 01, 2026",
      time: "2:30 PM",
      status: "Pending",
    },
  ],
  past: [
    { date: "Oct 10, 2026", type: "Consultation", clinician: "Dr. Emily Chen", status: "Completed" },
    { date: "Sep 29, 2026", type: "Check-in", clinician: "Dr. Emily Chen", status: "Completed" },
  ],
}
