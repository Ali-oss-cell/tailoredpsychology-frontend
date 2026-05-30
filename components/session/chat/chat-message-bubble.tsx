"use client"

import type { ChatMessageResponse } from "@/src/session/chat-api"
import { formatRelativeChatTime } from "@/src/session/chat-utils"

type ChatMessageBubbleProps = {
  message: ChatMessageResponse
  isOwnMessage: boolean
  showTimestamp?: boolean
}

export function ChatMessageBubble({ message, isOwnMessage, showTimestamp = false }: ChatMessageBubbleProps) {
  return (
    <div className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[min(78%,28rem)] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm transition-colors ${
          isOwnMessage
            ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground"
            : "rounded-2xl rounded-bl-md border border-border/70 bg-muted/80 text-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
        {showTimestamp ? (
          <p
            className={`mt-1 text-[10px] ${isOwnMessage ? "text-primary-foreground/75" : "text-muted-foreground"}`}
          >
            {formatRelativeChatTime(message.createdAt)}
          </p>
        ) : null}
      </div>
    </div>
  )
}
