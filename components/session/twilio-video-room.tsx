"use client"

import * as React from "react"
import { Microphone, MicrophoneSlash, PhoneDisconnect, VideoCamera, VideoCameraSlash } from "@phosphor-icons/react"
import type { LocalAudioTrack, LocalVideoTrack, RemoteParticipant, RemoteTrack, Room } from "twilio-video"

import { Button } from "@/components/ui/button"

export type TwilioVideoRoomProps = {
  accessToken: string
  roomName: string
  participantIdentity: string
  onLeave: () => void
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

export function TwilioVideoRoom({ accessToken, roomName, participantIdentity, onLeave }: TwilioVideoRoomProps) {
  const localVideoRef = React.useRef<HTMLDivElement>(null)
  const remoteContainerRef = React.useRef<HTMLDivElement>(null)
  const roomRef = React.useRef<Room | null>(null)
  const onLeaveRef = React.useRef(onLeave)
  const [status, setStatus] = React.useState<"connecting" | "connected" | "error">("connecting")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isVideoOff, setIsVideoOff] = React.useState(false)
  const [remoteCount, setRemoteCount] = React.useState(0)

  onLeaveRef.current = onLeave

  React.useEffect(() => {
    let cancelled = false
    const remoteTiles = new Map<string, HTMLDivElement>()

    function renderRemoteParticipant(participant: RemoteParticipant): void {
      const host = remoteContainerRef.current
      if (!host || remoteTiles.has(participant.sid)) return

      const tile = document.createElement("div")
      tile.className = "relative aspect-video overflow-hidden rounded-xl border border-border bg-muted"
      tile.dataset.participantSid = participant.sid

      const label = document.createElement("p")
      label.className =
        "absolute bottom-2 left-2 z-10 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white"
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
    roomRef.current?.disconnect()
    roomRef.current = null
    onLeave()
  }

  if (status === "error") {
    return (
      <div className="space-y-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">Could not start video call</p>
        <p className="text-muted-foreground text-xs">{errorMessage}</p>
        <Button type="button" size="sm" variant="outline" onClick={onLeave}>
          Back
        </Button>
      </div>
    )
  }

  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-3" aria-label="Video call">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <p className="text-sm font-medium">Live video session</p>
          <p className="text-muted-foreground text-xs">
            Room {roomName} · You: {participantIdentity}
          </p>
        </div>
        {status === "connecting" ? (
          <p className="text-muted-foreground text-xs">Connecting… allow camera and microphone if prompted.</p>
        ) : null}
      </div>

      <div className="relative">
        <div
          ref={remoteContainerRef}
          className={`grid min-h-[280px] gap-3 ${remoteCount > 1 ? "md:grid-cols-2" : "grid-cols-1"}`}
        >
          {status === "connected" && remoteCount === 0 ? (
            <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-4 text-center">
              <p className="text-muted-foreground text-sm">Waiting for the other participant to join…</p>
            </div>
          ) : null}
        </div>

        <div className="pointer-events-none absolute right-3 bottom-3 z-20 w-36 overflow-hidden rounded-lg border border-white/20 bg-black shadow-lg sm:w-44">
          <div ref={localVideoRef} className="aspect-video bg-black" />
          <p className="bg-black/80 px-2 py-1 text-[10px] text-white">You</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <Button type="button" size="sm" variant={isMuted ? "destructive" : "outline"} onClick={toggleMute}>
          {isMuted ? <MicrophoneSlash className="size-4" /> : <Microphone className="size-4" />}
          {isMuted ? "Unmute" : "Mute"}
        </Button>
        <Button type="button" size="sm" variant={isVideoOff ? "destructive" : "outline"} onClick={toggleVideo}>
          {isVideoOff ? <VideoCameraSlash className="size-4" /> : <VideoCamera className="size-4" />}
          {isVideoOff ? "Camera on" : "Camera off"}
        </Button>
        <Button type="button" size="sm" variant="destructive" onClick={leaveCall}>
          <PhoneDisconnect className="size-4" />
          Leave call
        </Button>
      </div>
    </section>
  )
}
