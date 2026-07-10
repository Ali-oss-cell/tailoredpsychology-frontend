import * as React from "react"

import { cn } from "@/lib/utils"

type PortalFormFieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function PortalFormField({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: PortalFormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? (
          <span className="text-destructive ml-0.5" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            id,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
          })
        : children}
      {hint ? (
        <p id={hintId} className="text-muted-foreground text-xs">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** Shared input styling for portal forms (booking, account, auth). */
export function portalInputClassName(hasError?: boolean) {
  return cn(
    "bg-background text-foreground border-border/70 focus-visible:ring-ring w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
    hasError && "border-destructive/60 focus-visible:ring-destructive/30",
  )
}

export type PortalTextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  hasError?: boolean
  className?: string
}

export const PortalTextInput = React.forwardRef<HTMLInputElement, PortalTextInputProps>(function PortalTextInput(
  { hasError, className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(portalInputClassName(hasError), className)} {...props} />
})

type PortalSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  hasError?: boolean
  className?: string
}

export const PortalSelect = React.forwardRef<HTMLSelectElement, PortalSelectProps>(function PortalSelect(
  { hasError, className, children, ...props },
  ref,
) {
  return (
    <select ref={ref} className={cn(portalInputClassName(hasError), className)} {...props}>
      {children}
    </select>
  )
})

type PortalTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  hasError?: boolean
  className?: string
}

export const PortalTextarea = React.forwardRef<HTMLTextAreaElement, PortalTextareaProps>(function PortalTextarea(
  { hasError, className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(portalInputClassName(hasError), "min-h-[5rem]", className)} {...props} />
})

type PortalFileUploadProps = {
  id: string
  label: string
  accept?: string
  hint?: string
  error?: string
  fileName?: string
  disabled?: boolean
  onFileSelect: (file: File | null) => void
  className?: string
}

export function PortalFileUpload({
  id,
  label,
  accept,
  hint,
  error,
  fileName,
  disabled,
  onFileSelect,
  className,
}: PortalFileUploadProps) {
  return (
    <PortalFormField id={id} label={label} hint={hint} error={error} className={className}>
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        className={cn(
          portalInputClassName(Boolean(error)),
          "file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs",
        )}
        onChange={(event) => onFileSelect(event.target.files?.[0] ?? null)}
      />
      {fileName ? <p className="text-muted-foreground text-xs">Selected: {fileName}</p> : null}
    </PortalFormField>
  )
}

export type PortalSearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type"> & {
  className?: string
  rounded?: "xl" | "full"
}

/** Unified search field styling for portal shell and ops filter bars. */
export const PortalSearchInput = React.forwardRef<HTMLInputElement, PortalSearchInputProps>(function PortalSearchInput(
  { className, rounded = "xl", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type="search"
      className={cn(
        portalInputClassName(),
        rounded === "full" ? "rounded-full py-2" : "py-2",
        className,
      )}
      {...props}
    />
  )
})

type PortalCheckboxFieldProps = {
  id: string
  label: React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  hint?: string
  error?: string
  className?: string
}

export function PortalCheckboxField({
  id,
  label,
  checked,
  onChange,
  disabled,
  hint,
  error,
  className,
}: PortalCheckboxFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-sm">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="border-border text-primary mt-0.5 size-4 shrink-0 rounded border"
        />
        <span>{label}</span>
      </label>
      {hint ? (
        <p id={hintId} className="text-muted-foreground pl-6 text-xs">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-destructive pl-6 text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
