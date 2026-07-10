import * as React from "react"
import { Eye, EyeSlash } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
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
    <div className={cn("space-y-2.5", className)}>
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
          className={cn("h-11 text-base", isPassword && "pr-11")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...inputProps}
        />
        {isPassword ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1.5 focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeSlash size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
          </button>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-muted-foreground text-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
