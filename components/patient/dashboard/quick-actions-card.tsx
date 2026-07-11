"use client"

import Link from "next/link"
import { ChatCircle, Microphone } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"

type QuickAction = {
  title: string
  icon: "message" | "video"
}

type QuickActionsCardProps = {
  actions: QuickAction[]
}

function getIcon(icon: QuickAction["icon"]) {
  if (icon === "message") return <ChatCircle size={16} />
  return <Microphone size={16} />
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  if (actions.length === 0) return null

  function handleActionClick(action: QuickAction): void {
    if (action.icon !== "message") return
    window.dispatchEvent(new CustomEvent("clink:open-chat"))
  }

  function getActionHref(action: QuickAction): string | null {
    if (action.icon === "video") return "/patient/video-setup"
    return null
  }

  return (
    <div className="flex flex-wrap gap-2" data-tutorial="patient.dashboard.quick-actions">
      {actions.map((action) => {
        const href = getActionHref(action)
        const icon = getIcon(action.icon)

        if (href) {
          return (
            <Button key={action.title} asChild variant="outline" size="sm" className="press gap-1.5 rounded-full">
              <Link href={href}>
                {icon}
                {action.title}
              </Link>
            </Button>
          )
        }

        return (
          <Button
            key={action.title}
            type="button"
            variant="outline"
            size="sm"
            className="press gap-1.5 rounded-full"
            onClick={() => handleActionClick(action)}
          >
            {icon}
            {action.title}
          </Button>
        )
      })}
    </div>
  )
}
