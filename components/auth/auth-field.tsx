import * as React from "react"
import { Eye, EyeSlash } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

type AuthFieldProps = {
  id: string
  label: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  hint?: string
  rightLabel?: React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "placeholder">

export function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  hint,
  rightLabel,
  ...inputProps
}: AuthFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = type === "password"
  const resolvedType = isPassword && showPassword ? "text" : type

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {rightLabel}
      </div>
      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          placeholder={placeholder}
          className={cn(
            "bg-background text-foreground border-border focus-visible:ring-ring w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors",
            "focus-visible:ring-2",
            isPassword && "pr-10",
          )}
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
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  )
}
