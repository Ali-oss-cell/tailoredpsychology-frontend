"use client"

import * as React from "react"
import {
  ArrowsIn,
  ArrowsOut,
  Microphone,
  MicrophoneSlash,
  PhoneDisconnect,
  VideoCamera,
  VideoCameraSlash,
} from "@phosphor-icons/react"
import type { LocalAudioTrack, LocalVideoTrack, RemoteParticipant, RemoteTrack, Room } from "twilio-video"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type TwilioVideoRoomProps = {
  accessToken: string
  roomName: string
  participantIdentity: string
  onLeave: () => void
  onConnectionStatusChange?: (status: "connecting" | "connected" | "error" | "idle") => void
}

function formatTwilioConnectError(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Could not connect to the video room."
  if (raw.includes("Invalid Access Token issuer/subject")) {
    return "Twilio rejected the join token: Account SID and API Key on the server do not match. In deploy/.env use TWILIO_ACCOUNT_SID (AC…), TWILIO_API_KEY (SK…), and the API Key Secret — not the Auth Token. Run: npm run verify:twilio on the backend container."
  }
  if (raw.includes("disconnected port object")) {
    return "Browser blocked the video connection (often a Chrome extension). Try incognito mode or disable extensions, then join again."
  }
  return raw
}

function attachTrack(track: RemoteTrack | LocalVideoTrack | LocalAudioTrack, container: HTMLElement): void {
  if (track.kind === "video" || track.kind === "audio") {
    const element = track.attach()
    if (track.kind === "video") {
      element.classList.add("h-full", "w-full", "object-cover")
    } else {
      element.classList.add("hidden")
    }
    container.appendChild(element)
  }
}

function detachTrack(track: RemoteTrack | LocalVideoTrack | LocalAudioTrack): void {
  if (track.kind === "video" || track.kind === "audio") {
    track.detach().forEach((node) => node.remove())
  }
}

async function enterFullscreen(element: HTMLElement): Promise<void> {
  if (element.requestFullscreen) {
    await element.requestFullscreen()
    return
  }
  const legacy = element as HTMLElement & { webkitRequestFullscreen?: () => void }
  legacy.webkitRequestFullscreen?.()
}

async function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    await document.exitFullscreen()
    return
  }
  const legacy = document as Document & { webkitExitFullscreen?: () => void }
  legacy.webkitExitFullscreen?.()
}

type ControlButtonProps = {
  label: string
  pressed?: boolean
  variant?: "default" | "destructive"
  onClick: () => void
  children: React.ReactNode
  fullscreen?: boolean
}

function ControlButton({ label, pressed, variant = "default", onClick, children, fullscreen }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={cn(
        "focus-visible:ring-ring inline-flex h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
        variant === "destructive"
          ? "border-destructive/40 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : pressed
            ? fullscreen
              ? "border-destructive/50 bg-destructive/80 text-white"
              : "border-destructive/40 bg-destructive/10 text-destructive"
            : fullscreen
              ? "border-white/20 bg-black/60 text-white hover:bg-black/80"
              : "border-border/70 bg-card hover:bg-muted/50 text-foreground",
      )}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function VideoRoomSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Connecting to video room">
      <Skeleton className="skeleton-shimmer aspect-video w-full rounded-2xl" />
      <div className="flex justify-center gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="skeleton-shimmer h-12 w-12 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function TwilioVideoRoom({
  accessToken,
  roomName,
  participantIdentity,
  onLeave,
  onConnectionStatusChange,
}: TwilioVideoRoomProps) {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const localVideoRef = React.useRef<HTMLDivElement>(null)
  const remoteContainerRef = React.useRef<HTMLDivElement>(null)
  const roomRef = React.useRef<Room | null>(null)
  const onLeaveRef = React.useRef(onLeave)
  const [status, setStatus] = React.useState<"connecting" | "connected" | "error">("connecting")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isVideoOff, setIsVideoOff] = React.useState(false)
  const [remoteCount, setRemoteCount] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [elapsedSec, setElapsedSec] = React.useState(0)
  const connectedAtRef = React.useRef<number | null>(null)

  onLeaveRef.current = onLeave

  React.useEffect(() => {
    onConnectionStatusChange?.(status)
  }, [status, onConnectionStatusChange])

  React.useEffect(() => {
    const syncFullscreen = (): void => {
      setIsFullscreen(document.fullscreenElement === stageRef.current)
    }
    document.addEventListener("fullscreenchange", syncFullscreen)
    return () => document.removeEventListener("fullscreenchange", syncFullscreen)
  }, [])

  React.useEffect(() => {
    if (status !== "connected") return
    connectedAtRef.current = Date.now()
    const id = window.setInterval(() => {
      if (connectedAtRef.current) {
        setElapsedSec(Math.floor((Date.now() - connectedAtRef.current) / 1000))
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [status])

  React.useEffect(() => {
    let cancelled = false
    const remoteTiles = new Map<string, HTMLDivElement>()

    function renderRemoteParticipant(participant: RemoteParticipant): void {
      const host = remoteContainerRef.current
      if (!host || remoteTiles.has(participant.sid)) return

      const tile = document.createElement("div")
      tile.className =
        "relative aspect-video overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm"
      tile.dataset.participantSid = participant.sid

      const label = document.createElement("p")
      label.className =
        "absolute bottom-3 left-3 z-10 rounded-lg bg-black/65 px-2.5 py-1 text-xs font-medium text-white"
      label.textContent = participant.identity
      tile.appendChild(label)

      host.appendChild(tile)
      remoteTiles.set(participant.sid, tile)
      setRemoteCount(remoteTiles.size)

      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed && publication.track) {
          attachTrack(publication.track, tile)
        }
      })

      participant.on("trackSubscribed", (track) => attachTrack(track, tile))
      participant.on("trackUnsubscribed", (track) => detachTrack(track))
    }

    function removeRemoteParticipant(participant: RemoteParticipant): void {
      const tile = remoteTiles.get(participant.sid)
      tile?.remove()
      remoteTiles.delete(participant.sid)
      setRemoteCount(remoteTiles.size)
    }

    async function connect(): Promise<void> {
      try {
        const Video = (await import("twilio-video")).default
        const room = await Video.connect(accessToken, {
          name: roomName,
          audio: true,
          video: { width: 1280, height: 720, frameRate: 24 },
        })

        if (cancelled) {
          room.disconnect()
          return
        }

        roomRef.current = room
        setStatus("connected")

        room.localParticipant.videoTracks.forEach((publication) => {
          if (publication.track && localVideoRef.current) {
            attachTrack(publication.track, localVideoRef.current)
          }
        })

        room.participants.forEach(renderRemoteParticipant)
        room.on("participantConnected", renderRemoteParticipant)
        room.on("participantDisconnected", removeRemoteParticipant)
        room.on("disconnected", () => {
          if (!cancelled) {
            onLeaveRef.current()
          }
        })
      } catch (error) {
        if (!cancelled) {
          setStatus("error")
          setErrorMessage(formatTwilioConnectError(error))
        }
      }
    }

    void connect()

    return () => {
      cancelled = true
      roomRef.current?.disconnect()
      roomRef.current = null
      remoteTiles.clear()
    }
  }, [accessToken, roomName])

  const toggleMute = (): void => {
    const room = roomRef.current
    if (!room) return
    const next = !isMuted
    room.localParticipant.audioTracks.forEach((publication) => {
      publication.track?.enable(!next)
    })
    setIsMuted(next)
  }

  const toggleVideo = (): void => {
    const room = roomRef.current
    if (!room) return
    const next = !isVideoOff
    room.localParticipant.videoTracks.forEach((publication) => {
      publication.track?.enable(!next)
    })
    setIsVideoOff(next)
  }

  const leaveCall = (): void => {
    if (document.fullscreenElement === stageRef.current) {
      void exitFullscreen()
    }
    roomRef.current?.disconnect()
    roomRef.current = null
    onLeave()
  }

  const toggleFullscreen = (): void => {
    const stage = stageRef.current
    if (!stage) return
    if (document.fullscreenElement === stage) {
      void exitFullscreen()
      return
    }
    void enterFullscreen(stage).catch(() => undefined)
  }

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (status !== "connected") return
      const target = event.target
      if (target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return
      if (event.key.toLowerCase() === "m") {
        event.preventDefault()
        toggleMute()
      }
      if (event.key.toLowerCase() === "v") {
        event.preventDefault()
        toggleVideo()
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault()
        toggleFullscreen()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [status, isMuted, isVideoOff])

  const elapsedLabel =
    elapsedSec >= 3600
      ? `${Math.floor(elapsedSec / 3600)}h ${Math.floor((elapsedSec % 3600) / 60)}m`
      : `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`

  if (status === "error") {
    return (
      <div
        className="border-destructive/40 bg-destructive/10 space-y-4 rounded-2xl border p-5"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-destructive text-sm font-semibold">Could not start video call</p>
        <p className="text-muted-foreground text-sm">{errorMessage}</p>
        <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={onLeave}>
          Back to workspace
        </Button>
      </div>
    )
  }

  if (status === "connecting") {
    return <VideoRoomSkeleton />
  }

  return (
    <section
      className="dashboard-card rounded-dashboard-card overflow-hidden p-0"
      aria-label="Video call"
      aria-keyshortcuts="M mute V camera F fullscreen"
    >
      <div className="border-border/50 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 md:px-5">
        <div>
          <p className="text-sm font-medium">Live session</p>
          <p className="text-muted-foreground text-xs">
            Room {roomName} · You: {participantIdentity}
          </p>
        </div>
        <p className="text-muted-foreground text-xs tabular-nums" aria-live="polite">
          Elapsed {elapsedLabel}
        </p>
      </div>

      <div
        ref={stageRef}
        className={cn(
          "relative",
          isFullscreen ? "flex min-h-full flex-col bg-black p-4" : "bg-muted/15 p-4",
        )}
      >
        <div className={cn("relative", isFullscreen && "min-h-0 flex-1")}>
          <div
            ref={remoteContainerRef}
            className={cn(
              "grid gap-3",
              isFullscreen ? "h-full min-h-[calc(100vh-8rem)] grid-cols-1" : "min-h-[280px] md:min-h-[360px]",
              !isFullscreen && remoteCount > 1 ? "md:grid-cols-2" : "grid-cols-1",
            )}
          >
            {status === "connected" && remoteCount === 0 ? (
              <div
                className={cn(
                  "flex aspect-video items-center justify-center rounded-2xl border border-dashed px-4 text-center",
                  isFullscreen
                    ? "border-white/20 bg-black/40 text-white"
                    : "border-border/70 bg-muted/30",
                )}
              >
                <div className="space-y-1">
                  <p className={cn("text-sm font-medium", isFullscreen ? "text-white" : "text-foreground")}>
                    Waiting for the other participant
                  </p>
                  <p className={cn("text-xs", isFullscreen ? "text-white/75" : "text-muted-foreground")}>
                    They will appear here when they join the room.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div
            className={cn(
              "pointer-events-none absolute z-20 overflow-hidden rounded-xl border border-white/25 bg-black shadow-lg",
              isFullscreen ? "right-6 bottom-28 w-44 sm:w-52" : "right-4 bottom-4 w-36 sm:w-44",
            )}
          >
            <div ref={localVideoRef} className="aspect-video bg-black" />
            <p className="bg-black/80 px-2.5 py-1 text-[10px] text-white">You</p>
          </div>
        </div>

        <div
          className={cn(
            "sticky bottom-0 z-10 flex flex-wrap items-center justify-center gap-2 pt-4",
            isFullscreen && "mt-4 border-t border-white/10",
          )}
          role="toolbar"
          aria-label="Call controls"
        >
          <ControlButton
            label={isMuted ? "Unmute" : "Mute"}
            pressed={isMuted}
            onClick={toggleMute}
            fullscreen={isFullscreen}
          >
            {isMuted ? <MicrophoneSlash className="size-5" aria-hidden /> : <Microphone className="size-5" aria-hidden />}
          </ControlButton>
          <ControlButton
            label={isVideoOff ? "Camera on" : "Camera off"}
            pressed={isVideoOff}
            onClick={toggleVideo}
            fullscreen={isFullscreen}
          >
            {isVideoOff ? (
              <VideoCameraSlash className="size-5" aria-hidden />
            ) : (
              <VideoCamera className="size-5" aria-hidden />
            )}
          </ControlButton>
          <ControlButton
            label={isFullscreen ? "Exit full screen" : "Full screen"}
            pressed={isFullscreen}
            onClick={toggleFullscreen}
            fullscreen={isFullscreen}
          >
            {isFullscreen ? <ArrowsIn className="size-5" aria-hidden /> : <ArrowsOut className="size-5" aria-hidden />}
          </ControlButton>
          <ControlButton label="Leave call" variant="destructive" onClick={leaveCall} fullscreen={isFullscreen}>
            <PhoneDisconnect className="size-5" aria-hidden />
          </ControlButton>
        </div>
        <p className="text-muted-foreground mt-2 text-center text-[11px]">
          Shortcuts: <kbd className="font-mono">M</kbd> mute · <kbd className="font-mono">V</kbd> camera ·{" "}
          <kbd className="font-mono">F</kbd> full screen
        </p>
      </div>
    </section>
  )
}
