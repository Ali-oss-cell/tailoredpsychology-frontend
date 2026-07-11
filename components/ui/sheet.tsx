"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  )
}

type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: "left" | "right"
}

function SheetContent({ side = "left", className, children, ...props }: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          "border-border bg-background fixed z-50 flex h-full flex-col gap-0 border shadow-xl transition ease-[var(--ease-out-quint, cubic-bezier(0.22,1,0.36,1))] duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in",
          side === "left" &&
            "inset-y-0 left-0 w-[min(100%,18rem)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          side === "right" &&
            "inset-y-0 right-0 w-[min(100%,18rem)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          className,
        )}
        {...props}
      >
        {children}
        <SheetClose className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none">
          <X size={18} aria-hidden />
          <span className="sr-only">Close navigation</span>
        </SheetClose>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-5 pb-0", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={cn("font-heading text-base font-semibold tracking-tight", className)} {...props} />
  )
}

export { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger }
