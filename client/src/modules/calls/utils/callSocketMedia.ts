import type { CallType } from "@calls/types/callSocket"

export const createLocalMediaConstraints = (type: CallType): MediaStreamConstraints => ({
  audio: true,
  video: type === "video" ? { facingMode: "user" } : false
})

export const stopMediaStream = (stream: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop())
}

export const setAudioTracksEnabled = (stream: MediaStream | null, enabled: boolean) => {
  stream?.getAudioTracks().forEach((track) => {
    track.enabled = enabled
  })
}

export const setVideoTracksEnabled = (stream: MediaStream | null, enabled: boolean) => {
  stream?.getVideoTracks().forEach((track) => {
    track.enabled = enabled
  })
}
