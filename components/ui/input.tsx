import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "bg-background text-foreground border-border/70 focus-visible:ring-ring flex h-10 w-full rounded-xl border px-3 text-sm shadow-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  )
})
