const VERSION_KEY = "clink_tutorial_version"
const COMPLETED_KEY = "clink_tutorial_completed"
const SNOOZED_KEY = "clink_tutorial_snoozed_v1"

/** Bump when step copy or anchors change materially (invalidates completion). */
export const TUTORIAL_CONTENT_VERSION = "6"

export type TutorialStorageSnapshot = {
  version: string
  completedStreams: string[]
  snoozedUntilByStream: Record<string, string>
}

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function readSnapshot(): TutorialStorageSnapshot {
  if (typeof window === "undefined") {
    return { version: TUTORIAL_CONTENT_VERSION, completedStreams: [], snoozedUntilByStream: {} }
  }
  const version = window.localStorage.getItem(VERSION_KEY) ?? ""
  const completedStreams = safeParseJson<string[]>(window.localStorage.getItem(COMPLETED_KEY), [])
  const snoozedUntilByStream = safeParseJson<Record<string, string>>(
    window.localStorage.getItem(SNOOZED_KEY),
    {},
  )
  return { version, completedStreams, snoozedUntilByStream }
}

function writeSnapshot(next: TutorialStorageSnapshot): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(VERSION_KEY, next.version)
  window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(next.completedStreams))
  window.localStorage.setItem(SNOOZED_KEY, JSON.stringify(next.snoozedUntilByStream))
}

/** If stored version differs from app version, clear completion/snooze so new tours can run. */
export function ensureTutorialVersionMigrated(): void {
  if (typeof window === "undefined") return
  const snap = readSnapshot()
  if (snap.version === TUTORIAL_CONTENT_VERSION) return
  writeSnapshot({
    version: TUTORIAL_CONTENT_VERSION,
    completedStreams: [],
    snoozedUntilByStream: {},
  })
}

export function isStreamCompleted(streamId: string): boolean {
  ensureTutorialVersionMigrated()
  return readSnapshot().completedStreams.includes(streamId)
}

export function markStreamCompleted(streamId: string): void {
  const snap = readSnapshot()
  if (snap.completedStreams.includes(streamId)) return
  const snoozedUntilByStream = { ...snap.snoozedUntilByStream }
  delete snoozedUntilByStream[streamId]
  writeSnapshot({
    ...snap,
    version: TUTORIAL_CONTENT_VERSION,
    completedStreams: [...snap.completedStreams, streamId],
    snoozedUntilByStream,
  })
}

export function snoozeStream(streamId: string, days: number): void {
  const snap = readSnapshot()
  const until = new Date(Date.now() + days * 86_400_000).toISOString()
  writeSnapshot({
    ...snap,
    version: TUTORIAL_CONTENT_VERSION,
    snoozedUntilByStream: { ...snap.snoozedUntilByStream, [streamId]: until },
  })
}

export function clearStreamSnooze(streamId: string): void {
  const snap = readSnapshot()
  if (!snap.snoozedUntilByStream[streamId]) return
  const snoozedUntilByStream = { ...snap.snoozedUntilByStream }
  delete snoozedUntilByStream[streamId]
  writeSnapshot({ ...snap, snoozedUntilByStream })
}

export function isStreamSnoozeActive(streamId: string): boolean {
  const snap = readSnapshot()
  const until = snap.snoozedUntilByStream[streamId]
  if (!until) return false
  return new Date(until).getTime() > Date.now()
}

export function shouldOfferStream(streamId: string): boolean {
  if (isStreamCompleted(streamId)) return false
  if (isStreamSnoozeActive(streamId)) return false
  return true
}

/** Remove completion so a stream can run again (e.g. Help “Replay”). */
export function replayStream(streamId: string): void {
  const snap = readSnapshot()
  writeSnapshot({
    ...snap,
    completedStreams: snap.completedStreams.filter((id) => id !== streamId),
  })
}
