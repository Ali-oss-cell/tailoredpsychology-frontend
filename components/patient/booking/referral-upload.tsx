"use client"

import * as React from "react"
import { FileArrowUp, FilePdf, Trash } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { cn } from "@/lib/utils"
import { uploadReferralDocument } from "@/src/patient/booking/api"
import type { ReferralFileDraft } from "@/src/patient/booking/types"

type ReferralUploadProps = {
  value: ReferralFileDraft
  onChange: (next: ReferralFileDraft) => void
}

const MAX_REFERRAL_SIZE_BYTES = 8 * 1024 * 1024

async function uploadSelectedFile(
  selected: File,
  value: ReferralFileDraft,
  onChange: (next: ReferralFileDraft) => void,
  setError: (message: string) => void,
  setIsUploading: (uploading: boolean) => void,
  setUploadProgress: (progress: number) => void,
) {
  if (selected.type !== "application/pdf") {
    setError("Please upload a PDF file only.")
    return
  }

  if (selected.size > MAX_REFERRAL_SIZE_BYTES) {
    setError("PDF is too large. Max size is 8MB.")
    return
  }

  setError("")
  setIsUploading(true)
  setUploadProgress(12)
  try {
    const uploaded = await uploadReferralDocument({
      file: selected,
      sourceType: value.sourceType || undefined,
      referralDate: value.referralDate || undefined,
      notes: value.notes || undefined,
    })
    setUploadProgress(100)

    onChange({
      ...value,
      file: selected,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      uploadedAt: uploaded.uploadedAt,
      documentId: uploaded.documentId,
      documentStatus: uploaded.status,
    })
  } catch (uploadError) {
    setError(uploadError instanceof Error ? uploadError.message : "Referral upload failed.")
    setUploadProgress(0)
  } finally {
    setIsUploading(false)
    window.setTimeout(() => setUploadProgress(0), 600)
  }
}

export function ReferralUpload({ value, onChange }: ReferralUploadProps) {
  const [error, setError] = React.useState("")
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [removeConfirmOpen, setRemoveConfirmOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const processFile = async (selected: File | undefined) => {
    if (!selected) return
    await uploadSelectedFile(selected, value, onChange, setError, setIsUploading, setUploadProgress)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await processFile(event.target.files?.[0])
    event.target.value = ""
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    await processFile(event.dataTransfer.files?.[0])
  }

  const clearFile = () => {
    setError("")
    onChange({
      ...value,
      file: null,
      fileName: "",
      fileSize: 0,
      uploadedAt: "",
      documentId: "",
      documentStatus: "",
    })
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(event) => void handleDrop(event)}
        className={cn(
          "dashboard-card rounded-dashboard-card border-border/60 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed p-6 text-center transition-colors md:p-8",
          isDragging && "border-primary/50 bg-primary/5",
          isUploading && "pointer-events-none opacity-80",
        )}
        aria-label="Upload referral PDF"
      >
        <FileArrowUp size={24} className="text-primary" aria-hidden />
        <p className="text-sm font-medium">
          {isUploading ? "Uploading referral…" : "Drag and drop your referral PDF here"}
        </p>
        <p className="text-muted-foreground text-xs">PDF only, up to 8MB — or click to choose a file</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(event) => void handleFileChange(event)}
          disabled={isUploading}
        />
      </div>

      {isUploading || uploadProgress > 0 ? (
        <div className="space-y-1" aria-live="polite">
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-[width] duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-muted-foreground text-xs">{isUploading ? "Uploading…" : "Upload complete"}</p>
        </div>
      ) : null}

      {value.fileName ? (
        <div className="dashboard-card rounded-dashboard-card border-border/70 flex items-center justify-between p-3">
          <p className="flex flex-col gap-1 text-sm">
            <span className="flex items-center gap-2">
              <FilePdf size={16} />
              {value.fileName}
            </span>
            {value.documentId ? (
              <span className="text-muted-foreground text-xs">
                Document ID: {value.documentId} • Status: {value.documentStatus || "received"}
              </span>
            ) : null}
          </p>
          <Button type="button" size="sm" variant="ghost" onClick={() => (value.documentId ? setRemoveConfirmOpen(true) : clearFile())} disabled={isUploading}>
            <Trash size={14} />
            Remove
          </Button>
        </div>
      ) : null}

      {error ? (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={removeConfirmOpen}
        variant="danger"
        title="Remove uploaded referral?"
        description="This removes the linked document from your booking draft. You can upload a new PDF if needed."
        confirmLabel="Remove file"
        onCancel={() => setRemoveConfirmOpen(false)}
        onConfirm={() => {
          setRemoveConfirmOpen(false)
          clearFile()
        }}
      />
    </div>
  )
}
