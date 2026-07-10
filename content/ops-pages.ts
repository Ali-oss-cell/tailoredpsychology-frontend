export const opsPagesContent = {
  managerDashboard: {
    title: "Practice Manager Dashboard",
    description: "Operational snapshot for staff, patient flow, appointments, and billing health.",
    cardTitle: "Today's Operations",
    rows: [
      { metric: "Active staff", value: "18", status: "Stable", action: "Open" },
      { metric: "Appointments", value: "42", status: "On track", action: "Open" },
      { metric: "Billing queue", value: "7", status: "Needs review", action: "Open" },
    ],
  },
  managerStaff: {
    title: "Manager Staff",
    description: "Review staff roster, role allocation, and operational readiness.",
    cardTitle: "Staff Roster",
    rows: [
      { name: "Dr. Emily Chen", role: "Psychologist", status: "Active", action: "Open" },
      { name: "Dr. Sam Park", role: "Psychologist", status: "Active", action: "Open" },
      { name: "Mia Jordan", role: "Coordinator", status: "Active", action: "Open" },
    ],
  },
  managerPatients: {
    title: "Manager Patients",
    description: "Practice-wide patient overview and support queue visibility.",
    cardTitle: "Patient Queue",
    rows: [
      { patient: "Liam M.", stage: "In care", status: "Stable", action: "Open" },
      { patient: "Olivia R.", stage: "Intake", status: "Review", action: "Open" },
      { patient: "Noah K.", stage: "In care", status: "Stable", action: "Open" },
    ],
  },
  managerAppointments: {
    title: "Manager Appointments",
    description: "Schedule oversight across clinicians and patient demand windows.",
    cardTitle: "Appointment Operations",
    rows: [
      { clinician: "Dr. Emily Chen", slots: "6 today", status: "Full", action: "Open" },
      { clinician: "Dr. Sam Park", slots: "4 today", status: "Available", action: "Open" },
      { clinician: "Dr. Alex Roy", slots: "5 today", status: "Full", action: "Open" },
    ],
  },
  managerBilling: {
    title: "Manager Billing",
    description: "Monitor invoice throughput, payment confirmations, and claim status.",
    cardTitle: "Billing Snapshot",
    rows: [
      { period: "Today", paid: "$4,120", pending: "$860", action: "Open" },
      { period: "This week", paid: "$22,640", pending: "$2,310", action: "Open" },
      { period: "This month", paid: "$81,200", pending: "$7,940", action: "Open" },
    ],
  },
  managerReferrals: {
    title: "Manager Referral Queue",
    description: "Review referral quality, triage actions, and onboarding eligibility decisions.",
    cardTitle: "Referral Verification Queue",
    rows: [
      { referral: "REF-902", source: "GP Portal", state: "Pending", action: "Open" },
      { referral: "REF-897", source: "Upload", state: "Review", action: "Open" },
      { referral: "REF-892", source: "GP Portal", state: "Approved", action: "Open" },
    ],
  },
  managerPrivacyRequests: {
    title: "Patient Data Requests",
    description: "Review and process patient access and correction requests in queue.",
    eyebrow: "Operations",
  },
  managerResources: {
    title: "Manager Resources",
    description: "Content governance and resource publication operations.",
    cardTitle: "Resource Moderation",
    rows: [
      { item: "Anxiety Toolkit", state: "Published", owner: "Clinical Team", action: "Open" },
      { item: "Sleep Reset Guide", state: "Draft", owner: "Content Ops", action: "Open" },
      { item: "Crisis Contacts", state: "Published", owner: "Admin", action: "Open" },
    ],
  },
  adminDashboard: {
    title: "Admin Dashboard",
    description: "System-wide oversight for users, appointments, billing, and compliance.",
    cardTitle: "System KPIs",
    rows: [
      { kpi: "Active users", value: "1,842", trend: "+3.2%", action: "Open" },
      { kpi: "Daily sessions", value: "214", trend: "+1.4%", action: "Open" },
      { kpi: "Open incidents", value: "2", trend: "Flat", action: "Open" },
    ],
  },
  adminUsers: {
    title: "Admin Users",
    description: "Manage user lifecycle, role assignment, and access governance.",
    cardTitle: "User Operations",
    rows: [
      { user: "sarah.chen@example.com", role: "patient", state: "Active", action: "Open" },
      { user: "emily.chen@clink.test", role: "psychologist", state: "Active", action: "Open" },
      { user: "ops@clink.test", role: "practice_manager", state: "Active", action: "Open" },
    ],
  },
  adminAppointments: {
    title: "Admin Appointments",
    description: "Global appointment oversight and exception handling.",
    cardTitle: "Appointment Control",
    rows: [
      { scope: "Total today", count: "214", status: "On track", action: "Open" },
      { scope: "Reschedules", count: "13", status: "Monitor", action: "Open" },
      { scope: "Cancellations", count: "7", status: "Stable", action: "Open" },
    ],
  },
  adminPatients: {
    title: "Admin Patients",
    description: "Global patient directory and onboarding progression visibility.",
    cardTitle: "Patient Directory",
    rows: [
      { group: "Active", count: "1,213", status: "Healthy", action: "Open" },
      { group: "Onboarding", count: "138", status: "Monitor", action: "Open" },
      { group: "Pending review", count: "24", status: "Action", action: "Open" },
    ],
  },
  adminStaff: {
    title: "Admin Staff",
    description: "System-level staffing, permissions, and roster governance.",
    cardTitle: "Staff Directory",
    rows: [
      { team: "Psychologists", count: "48", state: "Active", action: "Open" },
      { team: "Managers", count: "9", state: "Active", action: "Open" },
      { team: "Admins", count: "4", state: "Active", action: "Open" },
    ],
  },
  adminBilling: {
    title: "Admin Billing",
    description: "Revenue, invoice health, and payment flow governance.",
    cardTitle: "Financial Controls",
    rows: [
      { metric: "Revenue today", value: "$18,240", state: "Stable", action: "Open" },
      { metric: "Failed payments", value: "3", state: "Review", action: "Open" },
      { metric: "Pending claims", value: "27", state: "Monitor", action: "Open" },
    ],
  },
  adminSettings: {
    title: "Admin Settings",
    description: "System configuration and operational parameter management.",
    cardTitle: "Configuration Areas",
    rows: [
      { area: "Auth policies", state: "Configured", owner: "Admin", action: "Open" },
      { area: "Billing rules", state: "Configured", owner: "Finance", action: "Open" },
      { area: "Notification policy", state: "Configured", owner: "Ops", action: "Open" },
    ],
  },
  adminAnalytics: {
    title: "Admin Analytics",
    description: "Usage, throughput, and operational performance dashboards.",
    cardTitle: "Analytics Modules",
    rows: [
      { module: "Clinical throughput", status: "Live", cadence: "Daily", action: "Open" },
      { module: "Billing trends", status: "Live", cadence: "Daily", action: "Open" },
      { module: "Onboarding funnel", status: "Live", cadence: "Weekly", action: "Open" },
    ],
  },
  adminAuditLogs: {
    title: "Admin Audit Logs",
    description: "Security and compliance event stream with filters and controls.",
    cardTitle: "Recent Audit Events",
    rows: [
      { event: "Role update", actor: "admin@clink.test", severity: "Info", action: "Open" },
      { event: "Consent change", actor: "patient@clink.test", severity: "Info", action: "Open" },
      { event: "Data export", actor: "ops@clink.test", severity: "Review", action: "Open" },
    ],
  },
  adminDataDeletion: {
    title: "Data Deletion Requests",
    description: "Privacy workflow queue for deletion and retention-related actions.",
    cardTitle: "Deletion Queue",
    rows: [
      { request: "DEL-1201", owner: "privacy@clink", state: "Pending", action: "Open" },
      { request: "DEL-1198", owner: "privacy@clink", state: "Review", action: "Open" },
      { request: "DEL-1194", owner: "privacy@clink", state: "Approved", action: "Open" },
    ],
  },
  adminReferrals: {
    title: "Referral Verification Queue",
    description: "Review referral quality and approve onboarding eligibility paths.",
    cardTitle: "Referral Queue",
    rows: [
      { referral: "REF-902", source: "GP Portal", state: "Pending", action: "Open" },
      { referral: "REF-897", source: "Upload", state: "Review", action: "Open" },
      { referral: "REF-892", source: "GP Portal", state: "Approved", action: "Open" },
    ],
  },
  adminPrivacyRequests: {
    title: "Patient Data Requests",
    description: "Triage patient access and correction requests with SLA-aware workflow.",
    eyebrow: "Administration",
  },
  adminResources: {
    title: "Admin Resources",
    description: "Global resource governance and publication controls.",
    cardTitle: "Resource Governance",
    rows: [
      { item: "Trauma Toolkit", state: "Published", owner: "Clinical", action: "Open" },
      { item: "Burnout Guide", state: "Draft", owner: "Content", action: "Open" },
      { item: "Telehealth Safety", state: "Published", owner: "Admin", action: "Open" },
    ],
  },
} as const
