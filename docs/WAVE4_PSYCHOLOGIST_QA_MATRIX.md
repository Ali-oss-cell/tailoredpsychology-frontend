# Wave 4 Psychologist QA Matrix

Initial QA tracking for psychologist dashboard implementation.

Legend:
- `pass`: verified in code/build checks
- `manual-check`: needs browser/device interaction pass

| Route | Shell Reuse | Responsive | Light/Dark | Token-only styling | Keyboard/Focus | Notes |
|---|---|---|---|---|---|---|
| `/psychologist/dashboard` | pass | pass | pass | pass | manual-check | Uses `PsychologistShell` + modular dashboard cards. |
| `/psychologist/schedule` | pass | pass | pass | pass | manual-check | Timeline-focused schedule view in shared shell. |
| `/psychologist/patients` | pass | pass | pass | pass | manual-check | Caseload table with links to patient profile pages. |
| `/psychologist/patients/:patientId` | pass | pass | pass | pass | manual-check | Patient profile detail route with mock clinical summary. |
| `/psychologist/notes` | pass | pass | pass | pass | manual-check | Notes queue with draft/pending review states. |
| `/psychologist/profile` | pass | pass | pass | pass | manual-check | Professional details + bio editing surface. |
| `/psychologist/recordings` | pass | pass | pass | pass | manual-check | Recording list with transcript status. |

## Verification basis

- Shared shell/component architecture:
  - `components/psychologist/psychologist-shell.tsx`
  - `components/psychologist/dashboard/*`
- Content-driven composition:
  - `content/psychologist-dashboard.ts`
  - `content/psychologist-schedule.ts`
  - `content/psychologist-patients.ts`
  - `content/psychologist-notes.ts`
  - `content/psychologist-profile.ts`
  - `content/psychologist-recordings.ts`
- Route:
  - `app/psychologist/dashboard/page.tsx`
  - `app/psychologist/schedule/page.tsx`
  - `app/psychologist/patients/page.tsx`
  - `app/psychologist/patients/[patientId]/page.tsx`
  - `app/psychologist/notes/page.tsx`
  - `app/psychologist/profile/page.tsx`
  - `app/psychologist/recordings/page.tsx`

## Next action

Manual browser pass for:
- sidebar/topbar behavior on smaller breakpoints
- focus order across operations and timeline items
- dark mode readability for dense operational content
