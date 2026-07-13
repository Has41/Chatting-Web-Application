import { useEffect, useRef, useState } from "react"
import useAuth from "@auth/hooks/useAuth"
import useCloudinaryUpload from "@shared/hooks/useCloudinaryUpload"
import type { AudioRecorderProps } from "@chat/attachments/types/attachments"
import {
  AUDIO_MAX_DURATION_MS,
  createAudioFile,
  createAudioTempMessageId,
  createAudioUploadFolder,
  createLocalAudioMeta,
  createUploadedAudioMeta,
  stopMediaStream
} from "@chat/composer/utils/audioRecorder"

type UseAudioRecorderOptions = AudioRecorderProps

export const useAudioRecorder = ({
  onSend,
  setIsRecording,
  recipientId,
  conversationId,
  conversationType
}: UseAudioRecorderOptions) => {
  const { uploadFile } = useCloudinaryUpload()
  const { user } = useAuth()
  const [isPaused, setIsPaused] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioFileRef = useRef<File | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stopResolverRef = useRef<((file: File | null) => void) | null>(null)
  const keepStoppedAudioRef = useRef(true)

  const clearStopTimeout = () => {
    if (!stopTimeoutRef.current) return
    clearTimeout(stopTimeoutRef.current)
    stopTimeoutRef.current = null
  }

  const resetRecordingState = () => {
    setIsRecording(false)
    setIsPaused(false)
    audioFileRef.current = null
    chunksRef.current = []
  }

  const stopRecorderTracks = () => {
    const mediaRecorder = mediaRecorderRef.current
    stopMediaStream(mediaRecorder?.stream)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const file = createAudioFile(chunksRef.current)
        if (keepStoppedAudioRef.current) {
          audioFileRef.current = file
        }
        stopResolverRef.current?.(file)
        stopResolverRef.current = null
        keepStoppedAudioRef.current = true
        chunksRef.current = []
        stopMediaStream(stream)
        clearStopTimeout()
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      audioFileRef.current = null
      setIsRecording(true)
      setIsPaused(false)

      stopTimeoutRef.current = setTimeout(() => {
        keepStoppedAudioRef.current = true
        recorder.stop()
        setIsRecording(false)
      }, AUDIO_MAX_DURATION_MS)
    } catch (error) {
      console.error("Mic permission denied", error)
    }
  }

  const pauseResumeRecording = () => {
    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder) return

    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause()
      setIsPaused(true)
      return
    }

    if (mediaRecorder.state === "paused") {
      mediaRecorder.resume()
      setIsPaused(false)
    }
  }

  const cancelRecording = () => {
    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder) return

    if (mediaRecorder.state !== "inactive") {
      keepStoppedAudioRef.current = false
      mediaRecorder.stop()
    }

    stopRecorderTracks()
    resetRecordingState()
  }

  const stopAndGetRecording = () => {
    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder || mediaRecorder.state === "inactive") return Promise.resolve(audioFileRef.current)

    keepStoppedAudioRef.current = false

    return new Promise<File | null>((resolve) => {
      stopResolverRef.current = resolve
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
    })
  }

  const sendFailedAudioMessage = (clientTempId: string) => {
    onSend({
      messageType: "file",
      conversationId,
      clientTempId,
      markFailed: true
    })
  }

  const sendRecording = async () => {
    if (isSending) return

    setIsSending(true)
    const audioFile = audioFileRef.current ?? (await stopAndGetRecording())

    if (!audioFile) {
      console.log("Audio file not available!")
      setIsSending(false)
      return
    }

    const clientTempId = createAudioTempMessageId()
    const localPreviewUrl = URL.createObjectURL(audioFile)

    onSend({
      messageType: "file",
      fileMeta: createLocalAudioMeta(audioFile, localPreviewUrl),
      conversationId,
      clientTempId,
      optimisticOnly: true
    })

    const mediaRecorder = mediaRecorderRef.current
    if (mediaRecorder?.state !== "inactive") {
      keepStoppedAudioRef.current = false
      mediaRecorder?.stop()
    }
    stopRecorderTracks()

    try {
      const res = await uploadFile(
        audioFile,
        createAudioUploadFolder({
          conversationType,
          userId: user?._id,
          recipientId,
          conversationId
        }),
        audioFile.type,
        "audio"
      )

      if (!res?.secure_url) {
        sendFailedAudioMessage(clientTempId)
        return
      }

      onSend({
        messageType: "file",
        fileMeta: createUploadedAudioMeta({
          publicId: res.public_id,
          mediaUrl: res.secure_url,
          audioFile
        }),
        conversationId,
        clientTempId
      })
    } catch (error) {
      console.error("Error uploading audio:", error)
      sendFailedAudioMessage(clientTempId)
    } finally {
      setIsSending(false)
      resetRecordingState()
    }
  }

  useEffect(() => {
    return () => {
      const mediaRecorder = mediaRecorderRef.current
      if (mediaRecorder?.state !== "inactive") {
        keepStoppedAudioRef.current = false
        mediaRecorder?.stop()
      }
      stopMediaStream(mediaRecorder?.stream)
      clearStopTimeout()
    }
  }, [])

  return {
    isPaused,
    isSending,
    startRecording,
    pauseResumeRecording,
    cancelRecording,
    sendRecording
  }
}
