export type BrowserTelehealthCheckKey = "camera" | "microphone" | "network"

export type BrowserTelehealthCheckRow = {
  status: "pass" | "review"
  message: string
}

/**
 * In-browser camera/mic/network hints for telehealth (Wave 17).
 * Used by `PreSessionReadinessCard` (merged with server checks) and `PatientVideoSetupCard` (standalone).
 */
export async function runBrowserTelehealthChecks(): Promise<
  Record<BrowserTelehealthCheckKey, BrowserTelehealthCheckRow>
> {
  const camera: BrowserTelehealthCheckRow = {
    status: "review",
    message: "Camera check is unavailable in this browser.",
  }
  const microphone: BrowserTelehealthCheckRow = {
    status: "review",
    message: "Microphone check is unavailable in this browser.",
  }
  const network: BrowserTelehealthCheckRow = {
    status: "review",
    message: "Network check is unavailable in this browser.",
  }

  if (typeof window !== "undefined" && "navigator" in window) {
    const nav = window.navigator as Navigator & {
      connection?: { effectiveType?: string; downlink?: number; rtt?: number }
    }

    if (nav.mediaDevices?.getUserMedia) {
      try {
        const stream = await nav.mediaDevices.getUserMedia({ video: true, audio: true })
        const hasVideoTrack = stream.getVideoTracks().length > 0
        const hasAudioTrack = stream.getAudioTracks().length > 0
        stream.getTracks().forEach((track) => track.stop())

        if (hasVideoTrack) {
          camera.status = "pass"
          camera.message = "Camera access is available."
        } else {
          camera.message = "No camera track detected. Check camera device settings."
        }
        if (hasAudioTrack) {
          microphone.status = "pass"
          microphone.message = "Microphone access is available."
        } else {
          microphone.message = "No microphone track detected. Check microphone device settings."
        }
      } catch {
        camera.message = "Camera permission is blocked or unavailable."
        microphone.message = "Microphone permission is blocked or unavailable."
      }
    }

    const connection = nav.connection
    if (connection) {
      const effectiveType = connection.effectiveType ?? "unknown"
      const downlink = typeof connection.downlink === "number" ? connection.downlink : 0
      const rtt = typeof connection.rtt === "number" ? connection.rtt : 0
      const isGood = downlink >= 1 && (rtt === 0 || rtt < 300)
      network.status = isGood ? "pass" : "review"
      network.message = isGood
        ? `Network looks stable (${effectiveType}, ${downlink.toFixed(1)} Mbps).`
        : `Network may be unstable (${effectiveType}, ${downlink.toFixed(1)} Mbps).`
    }
  }

  return { camera, microphone, network }
}
