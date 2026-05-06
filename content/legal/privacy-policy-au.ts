/**
 * Australian-oriented privacy policy copy for the public `/privacy-policy` page.
 * DRAFT text for the public `/privacy-policy` page.
 * This file now uses a concrete entity name; legal sign-off is tracked separately.
 */
export const ENTITY_NAME = "Clink Health Pty Ltd"

export type PrivacyPolicySection = {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export const privacyPolicyEffectiveDate = "4 May 2026"

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    id: "about",
    title: "Who we are",
    paragraphs: [
      `This privacy policy describes how ${ENTITY_NAME} (“we”, “us”, “our”) collects, holds, uses, and discloses personal information when you use the Clink websites and applications (the “Services”).`,
      "We take privacy seriously. This document is written to align with common expectations under the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs), and with health-sector handling norms. It is not a substitute for legal advice for your specific circumstances.",
    ],
  },
  {
    id: "collection",
    title: "What personal information we collect",
    paragraphs: [
      "Depending on how you use the Services, we may collect:",
    ],
    bullets: [
      "Identity and contact details (e.g. name, email, phone, address).",
      "Account and authentication data (e.g. credentials, security events).",
      "Clinical and booking-related information you or your care team provide (e.g. intake responses, appointment details, referral documents where uploaded).",
      "Billing and payment-related identifiers (e.g. invoices, rebate-related metadata — not Medicare adjudication advice).",
      "Technical data (e.g. device type, IP address, logs, cookies) needed to operate and secure the Services.",
      "Communications you send us (e.g. support messages, privacy requests).",
    ],
  },
  {
    id: "sensitive",
    title: "Health information and sensitive information",
    paragraphs: [
      "Some information we handle may constitute health information or other sensitive information under the APPs (for example, information about mental health, referrals, or session notes). We collect and use such information only where reasonably necessary for the provision of health services, related administration, or as otherwise permitted by law.",
    ],
  },
  {
    id: "use",
    title: "Why we use personal information",
    paragraphs: ["We use personal information for purposes including:"],
    bullets: [
      "Providing, scheduling, and delivering clinical and telehealth sessions.",
      "Operating referrals, intake, billing, notifications, and internal workflows.",
      "Safety, fraud prevention, security monitoring, and audit trails.",
      "Responding to privacy rights requests (access, correction) and legal obligations.",
      "Improving the Services (using de-identified or aggregated data where appropriate).",
    ],
  },
  {
    id: "disclosure",
    title: "Who we disclose information to",
    paragraphs: [
      "We may disclose personal information to service providers that help us run the Services (for example, hosting, email, video communications, analytics) under contractual safeguards. Some providers may be located outside Australia — see “Overseas disclosure”.",
      "We may disclose information where required or authorised by law (for example, to regulators, courts, or emergency services in serious situations).",
      "Within a practice or organisation account, authorised staff (for example, clinicians, practice managers) may access information according to role-based access rules implemented in the product.",
    ],
  },
  {
    id: "overseas",
    title: "Overseas disclosure",
    paragraphs: [
      "Some subprocessors may process data outside Australia (for example, cloud or video infrastructure). Where APP 8 applies, we take reasonable steps to ensure overseas recipients handle information in line with the APPs, including through contractual clauses and vendor assessment. A current subprocessor list should be maintained internally and provided on request where your organisation’s transparency commitments require it.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We implement administrative, technical, and organisational measures designed to protect personal information from misuse, interference, loss, and unauthorised access, modification, or disclosure. No system is perfectly secure; if we become aware of a serious data breach affecting personal information, we will follow applicable Notifiable Data Breaches scheme steps under the Privacy Act.",
    ],
  },
  {
    id: "retention",
    title: "Retention and deletion",
    paragraphs: [
      "We retain information for as long as needed to provide the Services, meet legal and professional recordkeeping expectations (including for health records in Australia), and resolve disputes. Minimum retention periods for health records can depend on jurisdiction and patient age (for example, longer retention for records created when the individual was a minor). Internal retention and deletion rules for this codebase are described in `backend/docs/RETENTION_AND_DELETION_POLICY_AU.md` for engineering — that engineering document does not replace this policy or legal sign-off.",
    ],
  },
  {
    id: "rights",
    title: "Access, correction, and complaints",
    paragraphs: [
      "You may request access to, or correction of, the personal information we hold about you. In the Clink patient portal, privacy-related requests may be submitted through the data requests flow where enabled.",
      "If you are not satisfied with our response, you may complain to the Office of the Australian Information Commissioner (OAIC). See the OAIC website for current contact details and guidance.",
    ],
    bullets: ["OAIC: https://www.oaic.gov.au/"],
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    paragraphs: [
      "We may use cookies, local storage, and similar technologies for authentication, preferences, security, and limited analytics. You can control some cookies through your browser settings; blocking essential cookies may affect functionality.",
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    paragraphs: [
      "Where we send promotional communications, we will provide a way to opt out where required under the Spam Act 2003 (Cth) and applicable privacy laws. Clinical communications (for example, appointment reminders) are generally service messages, not direct marketing.",
    ],
  },
  {
    id: "children",
    title: "Children and guardians",
    paragraphs: [
      "Where services involve minors, a parent or guardian may need to provide consent and manage the account according to product rules and clinical governance. Replace this paragraph with your organisation’s agreed model after legal and clinical review.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. The “Last updated” date at the top will change when we do. Material changes should be communicated in-product or by email where appropriate.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "For privacy questions, use the public Clink contact channel at `/contact`. If your organisation publishes a dedicated privacy officer contact, keep that contact detail aligned between this policy and the contact page.",
    ],
  },
]
