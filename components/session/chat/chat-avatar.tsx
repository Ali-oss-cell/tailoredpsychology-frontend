"use client"

import { avatarHueFromId, initialsFromName } from "@/src/session/chat-utils"

type ChatAvatarProps = {
  name: string
  id: string
  imageUrl?: string
  isOnline?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "size-10 text-xs",
  md: "size-11 text-sm",
  lg: "size-12 text-sm",
} as const

const dotSizeClasses = {
  sm: "size-2.5 border-[1.5px]",
  md: "size-2.5 border-2",
  lg: "size-3 border-2",
} as const

export function ChatAvatar({ name, id, imageUrl, isOnline = false, size = "md", className = "" }: ChatAvatarProps) {
  const hue = avatarHueFromId(id)
  const initials = initialsFromName(name)

  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className={`${sizeClasses[size]} rounded-full object-cover ring-1 ring-border/60`}
        />
      ) : (
        <span
          className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full font-semibold text-white ring-1 ring-border/40`}
          style={{ backgroundColor: `hsl(${hue} 42% 42%)` }}
          aria-hidden
        >
          {initials}
        </span>
      )}
      {isOnline ? (
        <span
          className={`${dotSizeClasses[size]} absolute right-0 bottom-0 rounded-full border-card bg-success`}
          aria-label="Online"
        />
      ) : null}
    </span>
  )
}
