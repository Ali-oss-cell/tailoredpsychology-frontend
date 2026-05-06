# Website Pages Overview

High-level inventory of routed screens in the Clink frontend.
Source of truth for route registration is `src/routes/route-config.ts` (and the `app/` directory tree).

Core vs spec gap analysis (deep check): [`CORE_PLATFORM_DEEP_CHECK.md`](./CORE_PLATFORM_DEEP_CHECK.md).

## Access Legend

- `Public`: No login required
- `Auth`: Login/register/password flows; guest only
- `Patient`: `patient` role
- `Psychologist`: `psychologist` role
- `Manager`: `practice_manager` role (admin may share some routes)
- `Admin`: `admin` role
- `Shared`: Multiple roles (listed per route)

## Public Marketing and Information

| URL | Component | Access | Summary |
|---|---|---|---|
| `/` | `Homepage` | Public | Hero, trust chips, matching filters, CTAs, feature sections |
| `/about` | `AboutPage` | Public | Practice story and positioning |
| `/services` | `ServicesPage` | Public | Service formats and care model |
| `/why-clink` | `WhyClinkPage` | Public | Comparison page highlighting compliance, safety, and continuity capabilities |
| `/pricing` | `PricingPage` | Public | Canonical fee table and Medicare gap examples |
| `/trust` | `TrustPage` | Public | Trust metrics and privacy-control transparency page |
| `/conditions` | `ConditionsIndexPage` | Public | Index of condition-specific care pathway pages |
| `/conditions/:slug` | `ConditionPage` | Public | Condition detail page with pathway context and booking CTA |
| `/telehealth-requirements` | `TelehealthRequirementsPage` | Public | Telehealth requirements and emergency procedure |
| `/privacy-policy` | `PrivacyPolicyPage` | Public | Full privacy policy page |
| `/terms-of-service` | `TermsOfServicePage` | Public | Public terms and service usage conditions |
| `/resources` | `ResourcesPage` | Public | Public resource library |
| `/contact` | `ContactPage` | Public | Contact and enquiry pathways |
| `/get-matched` | `GetMatchedPage` | Public | Guided matching preferences flow |
| `/medicare-rebates` | `MedicareRebatesPage` | Public | Medicare rebate explainer |

Public marketing UX goals and acceptance criteria: [`WAVE18_PUBLIC_MARKETING_PAGES_UX.md`](./WAVE18_PUBLIC_MARKETING_PAGES_UX.md).

Compliance, privacy law map, and product gap analysis: [`PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md`](./PRODUCT_COMPLIANCE_PRIVACY_AND_GAPS.md).

## Authentication

| URL | Component | Access | Summary |
|---|---|---|---|
| `/login` | `LoginPage` | Auth | Email/password login |
| `/register` | `RegisterPage` | Auth | Registration shell and role-aware signup |
| `/forgot-password` | `ForgotPasswordPage` | Auth | Request password reset |
| `/reset-password` | `ResetPasswordPage` | Auth | Complete reset token flow |

## Patient Portal

| URL | Component | Access | Summary |
|---|---|---|---|
| `/patient/dashboard` | `PatientDashboardPage` | Patient | Booking readiness, shortcuts, dashboard cards |
| `/patient/video-setup` | `PatientVideoSetupPage` | Patient | Standalone camera/mic/network check before telehealth (Wave 17) |
| `/patient/setup` | `PatientSetupPage` | Patient | Onboarding wizard with intake and billing steps |
| `/patient/intake-form` | Redirect | Patient | Legacy redirect to `/patient/setup` |
| `/patient/appointment` | `PatientAppointmentPage` | Patient | Legacy simple appointment request form |
| `/patient/appointments` | `PatientAppointmentsPage` | Patient | Appointments list and management |
| `/patient/my-clinician` | `PatientMyClinicianPage` | Patient | Care team from live appointments (AHPRA-facing identity when linked) |
| `/patient/account` | `PatientAccountPage` | Patient | Profile, security, notifications, billing tabs |
| `/patient/invoices` | `PatientInvoicesPage` | Patient | Invoice history and billing details |
| `/patient/resources` | `PatientResourcesPage` | Patient | Authenticated patient resource listing |
| `/patient/resources/:id` | `ResourceDetailPage` | Patient | Resource detail page |

## Patient Booking Wizard

| URL | Component | Access | Summary |
|---|---|---|---|
| `/patient/book-appointment` | `PatientBookAppointmentPage` | Patient | Scheduling-first flow (patient layout; tutorials stay mounted) |
| `/appointments/book-appointment` | `LegacyBookAppointmentRedirect` | Patient | Redirects to `/patient/book-appointment` (preserves query string) |

Wizard uses local draft persistence. Referral PDF is upload-and-store only in this phase.

## Psychologist Portal

| URL | Component | Access | Summary |
|---|---|---|---|
| `/psychologist/dashboard` | `PsychologistDashboardPage` | Psychologist | Overview cards and operations bento |
| `/psychologist/profile` | `PsychologistProfilePage` | Psychologist | Professional profile and availability |
| `/psychologist/schedule` | `PsychologistSchedulePage` | Psychologist | Calendar and slot management |
| `/psychologist/patients` | `PsychologistPatientsPage` | Psychologist | Caseload list with filtering |
| `/psychologist/patients/:patientId` | `PsychologistPatientProfilePage` | Psychologist | Patient profile and record access |
| `/psychologist/notes` | `PsychologistNotesPage` | Psychologist | Progress notes authoring/listing |
| `/psychologist/recordings` | `PsychologistRecordingsPage` | Psychologist | Clinician recording list |
| `/patient/recordings` | `PatientRecordingsPage` | Patient | Patient-owned session recording list |
| `/patient/data-requests` | `PatientDataRequestsPage` | Patient | Submit and track access/correction requests |

## Practice Manager

| URL | Component | Access | Summary |
|---|---|---|---|
| `/manager/dashboard` | `PracticeManagerDashboardPage` | Manager, Admin | Operational overview |
| `/manager/staff` | `ManagerStaffPage` | Manager, Admin | Staff management |
| `/manager/patients` | `ManagerPatientsPage` | Manager, Admin | Practice-wide patient management |
| `/manager/appointments` | `ManagerAppointmentsPage` | Manager, Admin | Practice appointment operations |
| `/manager/billing` | `ManagerBillingPage` | Manager, Admin | Practice billing and invoices |
| `/manager/referrals` | `ManagerReferralsPage` | Manager, Admin | Referral verification queue and approval actions |
| `/manager/privacy-requests` | `ManagerPrivacyRequestsPage` | Manager, Admin | Triage queue for patient access/correction requests |
| `/manager/resources` | `ManagerResourcesPage` | Manager, Admin, Psychologist | Resource management and moderation |

## Admin

| URL | Component | Access | Summary |
|---|---|---|---|
| `/admin/dashboard` | `AdminDashboardPage` | Admin | Global KPI and actions |
| `/admin/users` | `UserManagementPage` | Admin | User/role administration |
| `/admin/appointments` | `AdminAppointmentsPage` | Admin | Global appointments |
| `/admin/patients` | `AdminPatientsPage` | Admin | Global patient directory |
| `/admin/staff` | `AdminStaffPage` | Admin | Global staff directory |
| `/admin/billing` | `AdminBillingPage` | Admin | Financial and billing operations |
| `/admin/settings` | `AdminSettingsPage` | Admin | System configuration |
| `/admin/analytics` | `AdminAnalyticsPage` | Admin | Usage and reporting dashboards |
| `/admin/audit-logs` | `AdminAuditLogsPage` | Admin | Security/compliance events |
| `/admin/security-incidents` | `AdminSecurityIncidentsPage` | Admin | Data breach incident register and NDB readiness workflow |
| `/admin/data-deletion` | `AdminDataDeletionPage` | Admin, Manager | Privacy workflow queue |
| `/admin/privacy-requests` | `AdminPrivacyRequestsPage` | Admin, Manager | Patient access/correction triage queue |
| `/admin/referrals` | `AdminReferralsPage` | Admin, Manager | Referral verification queue |
| `/admin/resources` | `AdminResourcesPage` | Admin, Manager, Psychologist | Resource management |

## Shared Clinical and Session Routes

| URL | Component | Access | Summary |
|---|---|---|---|
| `/recordings` | `RecordingsPage` | Patient, Psychologist, Manager, Admin | Shared recordings list |
| `/video-session/:appointmentId` | `VideoCallPage` | Patient, Psychologist, Manager, Admin | Twilio video session room |

## Error and Fallback

| URL | Component | Access | Summary |
|---|---|---|---|
| `*` | Inline 404 in `AppRoutes` | Public | Unknown route fallback |

## Maintenance Rules

1. When adding/removing/renaming routes, update this file and `src/routes/route-config.ts` together.
2. Keep booking flow as one protected URL unless backend/state-router requirements change.
3. If access changes, also update `docs/role-matrix.md`.
