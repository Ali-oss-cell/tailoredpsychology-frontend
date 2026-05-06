"use client"

import Link from "next/link"
import { CalendarPlus, ChatCircle, Receipt } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type QuickAction = {
  title: string
  subtitle: string
  icon: "book" | "message" | "invoice"
}

type QuickActionsCardProps = {
  actions: QuickAction[]
}

function getIcon(icon: QuickAction["icon"]) {
  if (icon === "book") return <CalendarPlus size={18} />
  if (icon === "message") return <ChatCircle size={18} />
  return <Receipt size={18} />
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  function handleActionClick(action: QuickAction): void {
    if (action.icon !== "message") return
    window.dispatchEvent(new CustomEvent("clink:open-chat"))
  }

  function getActionHref(action: QuickAction): string | null {
    if (action.icon === "book") return "/patient/book-appointment"
    if (action.icon === "invoice") return "/patient/invoices"
    return null
  }

  return (
    <Card className="md:col-span-4" data-tutorial="patient.dashboard.quick-actions">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.length === 0 ? <DashboardStateBlock variant="empty" message="No actions yet." /> : null}
        {actions.map((action) => {
          const href = getActionHref(action)
          const content = (
            <>
              <span className="bg-muted text-primary flex h-9 w-9 items-center justify-center rounded-full">
                {getIcon(action.icon)}
              </span>
              <span>
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-muted-foreground text-xs">{action.subtitle}</p>
              </span>
            </>
          )

          if (href) {
            return (
              <Link
                key={action.title}
                href={href}
                className="hover:bg-muted/70 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors"
              >
                {content}
              </Link>
            )
          }

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => handleActionClick(action)}
              className="hover:bg-muted/70 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors"
            >
              {content}
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
