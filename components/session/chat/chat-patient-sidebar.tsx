"use client"

import { MagnifyingGlass } from "@phosphor-icons/react"
import { type ChangeEvent, useMemo, useState } from "react"

import { ChatAvatar } from "@/components/session/chat/chat-avatar"
import { formatRelativeChatTime, truncateMessage } from "@/src/session/chat-utils"

export type ChatPatientThread = {
  patientId: string
  appointmentId: string
  displayName: string
  lastMessage?: string
  lastMessageAt?: string
  isOnline?: boolean
}

type ChatPatientSidebarProps = {
  threads: ChatPatientThread[]
  selectedAppointmentId: string | null
  onSelect: (thread: ChatPatientThread) => void
  isLoading?: boolean
}

export function ChatPatientSidebar({
  threads,
  selectedAppointmentId,
  onSelect,
  isLoading = false,
}: ChatPatientSidebarProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const list = normalized
      ? threads.filter((thread) => thread.displayName.toLowerCase().includes(normalized))
      : threads
    return [...list].sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
      return bTime - aTime
    })
  }, [query, threads])

  return (
    <aside className="border-border/70 flex h-full w-full flex-col border-r bg-card shadow-sm lg:w-[34%] lg:max-w-md lg:min-w-[280px]">
      <div className="border-border/60 sticky top-0 z-10 border-b bg-card/95 px-3 py-3 backdrop-blur md:px-4">
        <h2 className="mb-3 text-lg font-semibold">Messages</h2>
        <label className="relative block">
          <MagnifyingGlass
            size={16}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            placeholder="Search patients…"
            className="bg-muted/50 border-border focus-visible:ring-ring h-10 w-full rounded-full border pr-3 pl-9 text-sm outline-none transition-shadow focus-visible:ring-2"
          />
        </label>
      </div>

      <div className="chat-scroll min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="text-muted-foreground px-4 py-6 text-sm">Loading patients…</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground px-4 py-6 text-sm">
            {query ? "No patients match your search." : "No patients with active sessions."}
          </p>
        ) : (
          <ul className="divide-border/60 divide-y">
            {filtered.map((thread) => {
              const isActive = thread.appointmentId === selectedAppointmentId
              return (
                <li key={thread.patientId}>
                  <button
                    type="button"
                    onClick={() => onSelect(thread)}
                    className={`hover:bg-muted/60 flex w-full items-start gap-3 px-3 py-3 text-left transition-colors md:px-4 ${
                      isActive ? "bg-primary/10 hover:bg-primary/12 border-primary/30 border-l-2" : "border-l-2 border-transparent"
                    }`}
                  >
                    <ChatAvatar
                      name={thread.displayName}
                      id={thread.patientId}
                      isOnline={thread.isOnline}
                      size="md"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="mb-0.5 flex items-baseline justify-between gap-2">
                        <span className="truncate font-semibold">{thread.displayName}</span>
                        {thread.lastMessageAt ? (
                          <span className="text-muted-foreground shrink-0 text-[11px]">
                            {formatRelativeChatTime(thread.lastMessageAt)}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {thread.lastMessage ? truncateMessage(thread.lastMessage) : "No messages yet"}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
