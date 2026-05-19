#!/usr/bin/env node
/**
 * Wave 4 runtime smoke: API auth (N1), API RBAC (N2), patient booking → appointments (N8),
 * optional Next.js edge redirects when WEB_BASE is reachable.
 *
 * Usage (from repo root, with backend on 3001 and frontend on 3000):
 *   node scripts/wave4-runtime-smoke.mjs
 *
 * Env:
 *   API_BASE  default http://127.0.0.1:3001/api
 *   WEB_BASE  default http://127.0.0.1:3000
 *   SKIP_WEB  set to 1 to skip Next.js edge checks (curl)
 *   UPDATE_DOC set to 1 to write latest results into docs
 *   API_TRAILING_SLASH set to 1 when backend expects /path/ style URLs
 *   CORS_ORIGIN origin for W20-CORS-01 (defaults to WEB_BASE)
 *   SMOKE_*_EMAIL / SMOKE_*_PASSWORD override demo users for staging
 */

import { execFileSync } from "node:child_process"
import { writeFileSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const API_BASE = (process.env.API_BASE ?? "http://127.0.0.1:3001/api").replace(/\/$/, "")
const WEB_BASE = (process.env.WEB_BASE ?? "http://127.0.0.1:3000").replace(/\/$/, "")
const CORS_ORIGIN = (process.env.CORS_ORIGIN ?? WEB_BASE).replace(/\/$/, "")
const SKIP_WEB = process.env.SKIP_WEB === "1"
const UPDATE_DOC = process.env.UPDATE_DOC === "1"
const API_TRAILING_SLASH = process.env.API_TRAILING_SLASH === "1"
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const DOC_PATH = join(SCRIPT_DIR, "../docs/WAVE3_AUTH_RBAC_SMOKE_MATRIX.md")

function userCreds(role, defaults) {
  const key = role.toUpperCase()
  const email = process.env[`SMOKE_${key}_EMAIL`] ?? defaults.email
  const password = process.env[`SMOKE_${key}_PASSWORD`] ?? defaults.password
  return { email, password }
}

const USERS = {
  patient: userCreds("patient", { email: "patient@clink.test", password: "Patient123!" }),
  psychologist: userCreds("psychologist", { email: "psychologist@clink.test", password: "Psych123!" }),
  manager: userCreds("manager", { email: "manager@clink.test", password: "Manager123!" }),
  admin: userCreds("admin", { email: "admin@clink.test", password: "Admin123!" }),
}

async function api(path, options = {}) {
  const rawPath = path.startsWith("/") ? path : `/${path}`
  const withSlash = API_TRAILING_SLASH && !rawPath.endsWith("/") ? `${rawPath}/` : rawPath
  const url = `${API_BASE}${withSlash}`
  const method = options.method ?? "GET"
  const headers = { ...(options.headers ?? {}) }
  if (method !== "GET" && method !== "HEAD" && options.body) {
    headers["Content-Type"] = "application/json"
  }
  const res = await fetch(url, {
    ...options,
    headers,
  })
  const text = await res.text()
  let body
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = text
  }
  return { res, body }
}

async function apiRaw(path, options = {}) {
  const rawPath = path.startsWith("/") ? path : `/${path}`
  const withSlash = API_TRAILING_SLASH && !rawPath.endsWith("/") ? `${rawPath}/` : rawPath
  const url = `${API_BASE}${withSlash}`
  const res = await fetch(url, options)
  const buf = Buffer.from(await res.arrayBuffer())
  return { res, buf }
}

async function login(role) {
  const { email, password } = USERS[role]
  const { res, body } = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error(`${role} login failed: ${res.status} ${JSON.stringify(body)}`)
  }
  return { token: body.accessToken, user: body.user }
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

/** Next UTC weekday on or after `d` (Mon–Fri). */
function nextUtcWeekdayOnOrAfter(d) {
  const x = new Date(d)
  x.setUTCHours(12, 0, 0, 0)
  for (let i = 0; i < 14; i += 1) {
    const day = x.getUTCDay()
    if (day >= 1 && day <= 5) return x
    x.setUTCDate(x.getUTCDate() + 1)
  }
  return x
}

function curlRedirectProbe(path, cookie) {
  const url = `${WEB_BASE}${path}`
  const args = ["-sI", "-o", "/dev/null", "-w", "%{http_code}\n%{redirect_url}", url]
  if (cookie) {
    args.unshift("-H", `Cookie: ${cookie}`)
  }
  try {
    const out = execFileSync("curl", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })
    const [statusLine, locationLine] = out.trim().split("\n")
    const status = Number.parseInt(statusLine, 10)
    return { status: Number.isNaN(status) ? 0 : status, location: locationLine || null }
  } catch {
    return { status: 0, location: null }
  }
}

function toPassFailBlocked(value) {
  if (value === true) return "Pass"
  if (value === false) return "Fail"
  return "Blocked"
}

function summarizeEvidence(id, result) {
  if (!result) return "No data"
  if (id.startsWith("W4-AUTH")) return `role=${result.role ?? "unknown"}`
  if (id.startsWith("W4-RBAC")) return `status=${result.status ?? "n/a"}`
  if (id === "W4-JOURNEY-01") {
    return `booking=${result.bookingStatus ?? "n/a"}, list=${result.listStatus ?? "n/a"}, details=${result.appointmentDetailsStatus ?? "n/a"}`
  }
  return JSON.stringify(result)
}

function blockerSeverity(id, result) {
  if (result?.pass === true) return "—"
  if (id === "W4-JOURNEY-01" || id === "W4-RBAC-05") return "must-fix"
  return "release-risk"
}

function notesFor(id, result) {
  if (result?.pass === true) return "Automated run passed"
  if (id === "W4-JOURNEY-01") return result?.bookingWriteNote ?? "Journey incomplete"
  return "Check API/web logs"
}

async function corsPreflightCheck() {
  const url = `${API_BASE}/auth/login`
  const res = await fetch(url, {
    method: "OPTIONS",
    headers: {
      Origin: CORS_ORIGIN,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  })
  const allowOrigin = res.headers.get("access-control-allow-origin")
  const allowCreds = res.headers.get("access-control-allow-credentials")
  const pass =
    res.ok &&
    (allowOrigin === CORS_ORIGIN || allowOrigin === "*") &&
    (allowCreds === "true" || allowCreds === "True")
  return { pass, status: res.status, allowOrigin, allowCreds, origin: CORS_ORIGIN }
}

function buildLatestRunSection(results) {
  const ids = [
    "W4-AUTH-01",
    "W4-AUTH-02",
    "W4-AUTH-03",
    "W4-AUTH-04",
    "W4-RBAC-01",
    "W4-RBAC-02",
    "W4-RBAC-03",
    "W4-RBAC-04",
    "W4-RBAC-05",
    "W4-JOURNEY-01",
    "W20-CORS-01",
    "W20-JOIN-01",
    "W20-INVOICE-01",
  ]
  const now = new Date().toISOString()
  const lines = []
  lines.push(`_Last auto-update: \`${now}\`_`)
  lines.push("")
  lines.push("| Test ID | Result (`Pass`/`Fail`/`Blocked`) | Evidence | Blocker severity | Notes |")
  lines.push("|---|---|---|---|---|")
  for (const id of ids) {
    const r = results[id]
    lines.push(
      `| ${id} | ${toPassFailBlocked(r?.pass)} | ${summarizeEvidence(id, r)} | ${blockerSeverity(id, r)} | ${notesFor(id, r)} |`,
    )
  }
  lines.push("")
  lines.push("```json")
  lines.push(JSON.stringify(results, null, 2))
  lines.push("```")
  return lines.join("\n")
}

function updateDocWithLatestRun(results) {
  const startMarker = "<!-- W4_LATEST_RESULTS_START -->"
  const endMarker = "<!-- W4_LATEST_RESULTS_END -->"
  const doc = readFileSync(DOC_PATH, "utf8")
  const start = doc.indexOf(startMarker)
  const end = doc.indexOf(endMarker)
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`Could not find latest-result markers in ${DOC_PATH}`)
  }
  const section = buildLatestRunSection(results)
  const next =
    doc.slice(0, start + startMarker.length) +
    "\n\n" +
    section +
    "\n\n" +
    doc.slice(end)
  writeFileSync(DOC_PATH, next, "utf8")
}

async function main() {
  const results = {}

  const patientSession = await login("patient")
  const psychSession = await login("psychologist")
  const managerSession = await login("manager")
  const adminSession = await login("admin")
  const patientId = patientSession.user.id

  const expectedRoles = {
    patient: "patient",
    psychologist: "psychologist",
    manager: "practice_manager",
    admin: "admin",
  }
  results["W4-AUTH-01"] = { pass: patientSession.user.role === expectedRoles.patient, role: patientSession.user.role }
  results["W4-AUTH-02"] = { pass: psychSession.user.role === expectedRoles.psychologist, role: psychSession.user.role }
  results["W4-AUTH-03"] = { pass: managerSession.user.role === expectedRoles.manager, role: managerSession.user.role }
  results["W4-AUTH-04"] = { pass: adminSession.user.role === expectedRoles.admin, role: adminSession.user.role }

  // W4-RBAC-01 patient → admin ops
  {
    const { res } = await api("/admin/ops/appointments", {
      headers: { Authorization: `Bearer ${patientSession.token}` },
    })
    results["W4-RBAC-01"] = { pass: res.status === 403, status: res.status }
  }

  // W4-RBAC-02 psych → unrelated patient appointments (patient2)
  {
    const { res } = await api("/patients/user_patient_002/appointments", {
      headers: { Authorization: `Bearer ${psychSession.token}` },
    })
    results["W4-RBAC-02"] = { pass: res.status === 403, status: res.status }
  }

  // W4-RBAC-03 manager → admin ops
  {
    const { res } = await api("/admin/ops/appointments", {
      headers: { Authorization: `Bearer ${managerSession.token}` },
    })
    results["W4-RBAC-03"] = { pass: res.status === 403, status: res.status }
  }

  // W4-RBAC-04 admin → patient appointments (shared clinical read)
  {
    const { res, body } = await api(`/patients/${patientId}/appointments`, {
      headers: { Authorization: `Bearer ${adminSession.token}` },
    })
    results["W4-RBAC-04"] = {
      pass: res.status === 200 && body && typeof body === "object" && "upcoming" in body,
      status: res.status,
    }
  }

  // W4-JOURNEY-01 (API): availability → booking → list appointments
  const start = nextUtcWeekdayOnOrAfter(new Date())
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 7)
  const startDate = isoDate(start)
  const endDate = isoDate(end)

  const { res: avRes, body: availability } = await api(
    `/clinicians/availability?startDate=${startDate}&endDate=${endDate}&clinicianId=clinician_001`,
  )
  if (!avRes.ok) {
    results["W4-JOURNEY-01"] = { pass: false, step: "availability", status: avRes.status, body: availability }
  } else {
    const slots = availability[0]?.slots?.filter((s) => s.available) ?? []
    if (slots.length === 0) {
      results["W4-JOURNEY-01"] = { pass: false, step: "no_slot", startDate, endDate }
    } else {
      let brRes = { ok: false, status: 0 }
      let bookingBody = null
      for (const slot of slots) {
        const idempotencyKey = `wave4-smoke-${Date.now()}-${slot.slotId}`
        const attempt = await api("/booking-requests", {
          method: "POST",
          headers: { Authorization: `Bearer ${patientSession.token}` },
          body: JSON.stringify({
            clinicianId: "clinician_001",
            slotId: slot.slotId,
            appointmentDate: slot.date,
            timezone: "Australia/Sydney",
            idempotencyKey,
            notes: "Wave 4 automated smoke",
          }),
        })
        brRes = attempt.res
        bookingBody = attempt.body
        if (attempt.res.ok || attempt.res.status === 201) {
          break
        }
        if (attempt.res.status !== 409) {
          break
        }
      }
      const { res: listRes, body: listBody } = await api(`/patients/${patientId}/appointments`, {
        headers: { Authorization: `Bearer ${patientSession.token}` },
      })
      const upcoming = listBody?.upcoming ?? []
      const past = listBody?.past ?? []
      const createdId = bookingBody?.bookingRequestId ? `appt_${bookingBody.bookingRequestId}` : null
      const inList =
        createdId &&
        (upcoming.some((a) => a.appointmentId === createdId) || past.some((a) => a.appointmentId === createdId))
      let detailsOk = false
      let detailsStatus = 0
      if (listRes.ok && upcoming.length > 0) {
        const aid = upcoming[0].appointmentId
        const det = await api(`/appointments/${aid}`, {
          headers: { Authorization: `Bearer ${patientSession.token}` },
        })
        detailsStatus = det.res.status
        detailsOk = det.res.ok
      }
      const bookingOk = brRes.ok || brRes.status === 201
      let directAppointmentOk = false
      if (createdId && bookingOk) {
        const direct = await api(`/appointments/${createdId}`, {
          headers: { Authorization: `Bearer ${patientSession.token}` },
        })
        directAppointmentOk = direct.res.ok
      }
      const hasCreated = Boolean(inList || directAppointmentOk)
      /** N8 API bar: availability → create booking → list includes new row → appointment details (join prep). */
      const pass =
        avRes.ok &&
        listRes.ok &&
        upcoming.length > 0 &&
        detailsOk &&
        bookingOk &&
        (hasCreated || bookingBody?.idempotentReplay === true)
      results["W4-JOURNEY-01"] = {
        pass,
        bookingStatus: brRes.status,
        listStatus: listRes.status,
        bookingRequestId: bookingBody?.bookingRequestId,
        upcomingCount: upcoming.length,
        pastCount: past.length,
        idempotentReplay: bookingBody?.idempotentReplay === true,
        appointmentDetailsStatus: detailsStatus,
        appointmentDetailsOk: detailsOk,
        directAppointmentOk,
        bookingWriteOk: bookingOk,
        bookingWriteNote: bookingOk
          ? hasCreated || bookingBody?.idempotentReplay
            ? "ok"
            : "created_but_not_listed_yet"
          : "skipped_or_failed",
      }
    }
  }

  // --- Optional Next.js edge (cookie RBAC) ---
  results["WEB_probe"] = { base: WEB_BASE, skip: SKIP_WEB }
  if (!SKIP_WEB) {
    try {
      const guestDash = curlRedirectProbe("/patient/dashboard")
      results["WEB_guest_patient_dashboard"] = guestDash

      const patientBlock = curlRedirectProbe("/admin/dashboard", "clink_role=patient")
      results["WEB_W4-RBAC-01"] = patientBlock

      const patientLogin = curlRedirectProbe("/login", "clink_role=patient")
      results["WEB_W4-RBAC-05"] = patientLogin
      results["W4-RBAC-05"] = {
        pass:
          patientLogin.status === 307 &&
          typeof patientLogin.location === "string" &&
          patientLogin.location.includes("/patient/dashboard"),
        status: patientLogin.status,
        location: patientLogin.location,
      }

      const video = curlRedirectProbe("/video-session/appt_open_001", "clink_role=patient")
      results["WEB_video_session_shell"] = video
    } catch (e) {
      results["WEB_error"] = String(e?.message ?? e)
      results["W4-RBAC-05"] = { pass: false, status: 0, location: null }
    }
  } else {
    results["W4-RBAC-05"] = { pass: false, status: 0, location: null }
  }

  // --- Wave 20: CORS, join token, invoice PDF ---
  results["W20-CORS-01"] = await corsPreflightCheck()

  {
    const { res: listRes, body: listBody } = await api(`/patients/${patientId}/appointments`, {
      headers: { Authorization: `Bearer ${patientSession.token}` },
    })
    const upcoming = listBody?.upcoming ?? []
    const apptId = upcoming[0]?.appointmentId
    if (!listRes.ok || !apptId) {
      results["W20-JOIN-01"] = { pass: false, note: "no_upcoming_appointment", status: listRes.status }
    } else {
      const join = await api(`/appointments/${apptId}/join-session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${patientSession.token}` },
        body: JSON.stringify({ channel: "video" }),
      })
      const tokenOk =
        join.res.ok &&
        join.body &&
        typeof join.body.accessToken === "string" &&
        join.body.accessToken.length > 10 &&
        typeof join.body.roomName === "string"
      results["W20-JOIN-01"] = {
        pass: tokenOk,
        status: join.res.status,
        appointmentId: apptId,
        roomName: join.body?.roomName,
      }
    }
  }

  {
    const { res: invListRes, body: invoices } = await api("/billing/invoices", {
      headers: { Authorization: `Bearer ${patientSession.token}` },
    })
    const firstId = Array.isArray(invoices) && invoices[0]?.invoiceId
    if (!invListRes.ok || !firstId) {
      results["W20-INVOICE-01"] = { pass: false, note: "no_invoice", status: invListRes.status }
    } else {
      const dl = await apiRaw(`/billing/invoices/${firstId}/download`, {
        headers: { Authorization: `Bearer ${patientSession.token}` },
      })
      const contentType = dl.res.headers.get("content-type") ?? ""
      const pdfMagic = dl.buf.length >= 4 && dl.buf.subarray(0, 4).toString("utf8") === "%PDF"
      results["W20-INVOICE-01"] = {
        pass: dl.res.ok && contentType.includes("pdf") && pdfMagic,
        status: dl.res.status,
        contentType,
        invoiceId: firstId,
        bytes: dl.buf.length,
      }
    }
  }

  console.log(JSON.stringify(results, null, 2))
  if (UPDATE_DOC) {
    updateDocWithLatestRun(results)
    console.log(`Updated ${DOC_PATH} latest results block.`)
  }
  const apiKeys = Object.keys(results).filter((k) => k.startsWith("W4-") || k.startsWith("W20-"))
  const allApiPass = apiKeys.every((k) => results[k]?.pass === true)
  if (!allApiPass) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
