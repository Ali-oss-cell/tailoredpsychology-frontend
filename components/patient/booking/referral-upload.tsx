"use client"

import * as React from "react"
import { FileArrowUp, FilePdf, Trash } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { uploadReferralDocument } from "@/src/patient/booking/api"
import type { ReferralFileDraft } from "@/src/patient/booking/types"

type ReferralUploadProps = {
  value: ReferralFileDraft
  onChange: (next: ReferralFileDraft) => void
}

const MAX_REFERRAL_SIZE_BYTES = 8 * 1024 * 1024

export function ReferralUpload({ value, onChange }: ReferralUploadProps) {
  const [error, setError] = React.useState("")
  const [isUploading, setIsUploading] = React.useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) {
      return
    }

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
    try {
      const uploaded = await uploadReferralDocument({
        file: selected,
        sourceType: value.sourceType || undefined,
        referralDate: value.referralDate || undefined,
        notes: value.notes || undefined,
      })

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
    } finally {
      setIsUploading(false)
    }
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
      <label className="bg-muted/40 border-border/60 flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3">
        <span className="text-sm">{isUploading ? "Uploading referral..." : "Upload referral PDF (optional, max 8MB)"}</span>
        <span className="text-primary flex items-center gap-1 text-xs font-medium">
          <FileArrowUp size={14} />
          Choose file
        </span>
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} disabled={isUploading} />
      </label>

      {value.fileName ? (
        <div className="bg-background border-border/70 flex items-center justify-between rounded-lg border p-3">
          <p className="flex flex-col gap-1 text-sm">
            <span className="flex items-center gap-2">
            <FilePdf size={16} />
            {value.fileName}
            </span>
            {value.documentId ? (
              <span className="text-xs text-muted-foreground">
                Document ID: {value.documentId} • Status: {value.documentStatus || "received"}
              </span>
            ) : null}
          </p>
          <Button type="button" size="sm" variant="ghost" onClick={clearFile} disabled={isUploading}>
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
    </div>
  )
}

