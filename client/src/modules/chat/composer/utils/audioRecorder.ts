import { ROOT_FOLDER } from "@shared/constants/constantValues"
import type { ConversationType, MessageFileMeta } from "@chat/attachments/types/attachments"

export const AUDIO_RECORDING_NAME = "recording.webm"
export const AUDIO_RECORDING_TYPE = "audio/webm"
export const AUDIO_MAX_DURATION_MS = 2 * 60 * 1000

export const createAudioTempMessageId = () => `temp-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`

export const createAudioFile = (chunks: Blob[]) =>
  new File(chunks, AUDIO_RECORDING_NAME, {
    type: AUDIO_RECORDING_TYPE
  })

export const stopMediaStream = (stream?: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop())
}

export const createAudioUploadFolder = ({
  conversationType,
  userId,
  recipientId,
  conversationId
}: {
  conversationType?: ConversationType
  userId?: string
  recipientId?: string
  conversationId?: string
}) => {
  if (conversationType === "private") return `${ROOT_FOLDER}/${userId}/chat-uploads/chat-with-${recipientId}`
  return `${ROOT_FOLDER}/${userId}/chat-uploads/group-${conversationId}`
}

export const createLocalAudioMeta = (audioFile: File, localPreviewUrl: string): MessageFileMeta => ({
  media_url: localPreviewUrl,
  mediaType: "audio",
  mimeType: audioFile.type,
  fileName: audioFile.name
})

export const createUploadedAudioMeta = ({
  publicId,
  mediaUrl,
  audioFile
}: {
  publicId?: string
  mediaUrl: string
  audioFile: File
}): MessageFileMeta => ({
  public_url: publicId,
  media_url: mediaUrl,
  mediaType: "audio",
  mimeType: audioFile.type,
  fileName: audioFile.name
})
