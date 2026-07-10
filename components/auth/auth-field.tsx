import * as React from "react"
import { Eye, EyeSlash } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
  PortalFormField,
  PortalTextInput,
  type PortalTextInputProps,
} from "@/components/shared/portal-form-field"

type AuthFieldProps = {
  id: string
  label: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  hint?: string
  error?: string
  rightLabel?: React.ReactNode
} & Omit<PortalTextInputProps, "id" | "type" | "placeholder" | "hasError">

export function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  hint,
  error,
  rightLabel,
  className,
  ...inputProps
}: AuthFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = type === "password"
  const resolvedType = isPassword && showPassword ? "text" : type

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {rightLabel}
      </div>
      <div className="relative">
        <PortalTextInput
          id={id}
          type={resolvedType}
          placeholder={placeholder}
          hasError={Boolean(error)}
          className={cn(isPassword && "pr-10")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...inputProps}
        />
        {isPassword ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeSlash size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
          </button>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-muted-foreground text-xs">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
