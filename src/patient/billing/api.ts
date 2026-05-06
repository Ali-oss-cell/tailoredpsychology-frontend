"use client"

import { ensureBackendAccessToken } from "@/src/patient/booking/api"

const DEFAULT_API_BASE = "http://localhost:3001/api"

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE
}

function buildApiUrl(path: string): URL {
  const base = getApiBaseUrl()
  const normalizedBase = base.endsWith("/") ? base : `${base}/`
  return new URL(path, normalizedBase)
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await ensureBackendAccessToken()
  return { Authorization: `Bearer ${token}` }
}

export type InvoiceSummary = {
  invoiceId: string
  issuedDate: string
  amountLabel: string
  status: string
}

export async function listPatientInvoices(): Promise<InvoiceSummary[]> {
  const response = await fetch(buildApiUrl("billing/invoices").toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`List invoices failed (${response.status})`)
  return (await response.json()) as InvoiceSummary[]
}

export type PatientInvoiceDownloadResult = {
  blob: Blob
  /** From `Content-Disposition` when present; otherwise derived from `Content-Type` or invoice id. */
  filename: string
  contentType: string | null
}

function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null
  const star = /filename\*=(?:UTF-8''|)([^;]+)/i.exec(header)
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].trim().replace(/^"(.*)"$/, "$1"))
    } catch {
      return star[1].trim().replace(/^"(.*)"$/, "$1")
    }
  }
  const plain = /filename="([^"]+)"/i.exec(header) ?? /filename=([^;\s]+)/i.exec(header)
  if (plain?.[1]) return plain[1].trim()
  return null
}

function extensionForMime(mime: string | null): string {
  if (!mime) return "bin"
  const m = mime.split(";")[0]?.trim().toLowerCase() ?? ""
  if (m === "application/pdf") return "pdf"
  if (m === "text/plain" || m.startsWith("text/")) return "txt"
  if (m === "text/csv" || m.includes("csv")) return "csv"
  return "bin"
}

export async function downloadPatientInvoice(invoiceId: string): Promise<PatientInvoiceDownloadResult> {
  const response = await fetch(buildApiUrl(`billing/invoices/${encodeURIComponent(invoiceId)}/download`).toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Download invoice failed (${response.status})`)
  const blob = await response.blob()
  const contentType = response.headers.get("Content-Type")
  const fromHeader = filenameFromContentDisposition(response.headers.get("Content-Disposition"))
  const mime = contentType ?? blob.type ?? null
  const ext = extensionForMime(mime)
  const filename =
    fromHeader && /\.\w{2,8}$/i.test(fromHeader) ? fromHeader : `${invoiceId}.${ext}`

  return { blob, filename, contentType }
}
