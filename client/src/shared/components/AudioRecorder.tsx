import { useEffect, useRef, useState } from "react"
import useCloudinaryUpload from "@shared/hooks/useCloudinaryUpload"
import { ROOT_FOLDER } from "@shared/constants/constantValues"
import useAuth from "@auth/hooks/useAuth"
import type { AudioRecorderProps } from "@shared/types/components"

const createTempMessageId = () => `temp-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`

const AudioRecorder = ({
  onSend,
  isRecording,
  setIsRecording,
  recipientId,
  conversationId,
  conversationType
}: AudioRecorderProps) => {
  const { uploadFile } = useCloudinaryUpload()
  const { user } = useAuth()
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [audioURL, setAudioURL] = useState<File | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stopResolverRef = useRef<((file: File | null) => void) | null>(null)
  const keepStoppedAudioRef = useRef(true)

  const MAX_DURATION = 2 * 60 * 1000 // 2 minutes in ms

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const file = new File(chunksRef.current, "recording.webm", {
          type: "audio/webm"
        })
        if (keepStoppedAudioRef.current) {
          setAudioURL(file)
        }
        stopResolverRef.current?.(file)
        stopResolverRef.current = null
        keepStoppedAudioRef.current = true
        chunksRef.current = []
        stream.getTracks().forEach((track) => track.stop())

        if (stopTimeoutRef.current) {
          clearTimeout(stopTimeoutRef.current)
          stopTimeoutRef.current = null
        }
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setIsPaused(false)
      setAudioURL(null)

      // auto-stop after 2 minutes
      stopTimeoutRef.current = setTimeout(() => {
        keepStoppedAudioRef.current = true
        recorder.stop()
        setIsRecording(false)
      }, MAX_DURATION)
    } catch (err) {
      console.error("Mic permission denied", err)
    }
  }

  const pauseResumeRecording = () => {
    if (!mediaRecorder) return
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause()
      setIsPaused(true)
    } else if (mediaRecorder.state === "paused") {
      mediaRecorder.resume()
      setIsPaused(false)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorder) {
      if (mediaRecorder.state !== "inactive") {
        keepStoppedAudioRef.current = false
        mediaRecorder.stop()
      }
      mediaRecorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      setIsRecording(false)
      setIsPaused(false)
      setAudioURL(null)
      chunksRef.current = []
    }
  }

  const stopAndGetRecording = () => {
    if (!mediaRecorder) return Promise.resolve(audioURL)

    if (mediaRecorder.state === "inactive") {
      return Promise.resolve(audioURL)
    }

    keepStoppedAudioRef.current = false

    return new Promise<File | null>((resolve) => {
      stopResolverRef.current = resolve
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
    })
  }

  const sendRecording = async () => {
    if (isSending) return

    setIsSending(true)
    const audioFile = audioURL ?? (await stopAndGetRecording())

    if (!audioFile) {
      console.log("Audio file not available!")
      setIsSending(false)
      return
    }

    const clientTempId = createTempMessageId()
    const localPreviewUrl = URL.createObjectURL(audioFile)

    onSend({
      messageType: "file",
      fileMeta: {
        media_url: localPreviewUrl,
        mediaType: "audio",
        mimeType: audioFile.type,
        fileName: audioFile.name
      },
      conversationId,
      clientTempId,
      optimisticOnly: true
    })

    if (mediaRecorder) {
      if (mediaRecorder.state !== "inactive") {
        keepStoppedAudioRef.current = false
        mediaRecorder.stop()
      }
      mediaRecorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    }

    try {
      const res = await uploadFile(
        audioFile,
        conversationType === "private"
          ? `${ROOT_FOLDER}/${user?._id}/chat-uploads/chat-with-${recipientId}`
          : `${ROOT_FOLDER}/${user?._id}/chat-uploads/group-${conversationId}`,
        audioFile.type,
        "audio"
      )

      if (res?.secure_url) {
        const fileMeta = {
          public_url: res?.public_id,
          media_url: res?.secure_url,
          mediaType: "audio" as const,
          mimeType: audioFile.type,
          fileName: audioFile.name
        }

        onSend({
          messageType: "file",
          fileMeta,
          conversationId,
          clientTempId
        })
      } else {
        onSend({
          messageType: "file",
          conversationId,
          clientTempId,
          markFailed: true
        })
      }
    } catch (error) {
      console.error("Error uploading audio:", error)
      onSend({
        messageType: "file",
        conversationId,
        clientTempId,
        markFailed: true
      })
    }

    setIsRecording(false)
    setIsPaused(false)
    setIsSending(false)
    setAudioURL(null)
    chunksRef.current = []
  }

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        if (mediaRecorder.state !== "inactive") {
          keepStoppedAudioRef.current = false
          mediaRecorder.stop()
        }
        mediaRecorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      }
    }
  }, [mediaRecorder])

  return (
    <div className="flex items-center gap-2">
      {/* Mic button */}
      {!isRecording && (
        <div>
          <button
            onClick={startRecording}
            className="hover:text-custom-text rounded-full p-3 text-black/80 transition-all duration-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>
          </button>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-2">
          <button
            onClick={cancelRecording}
            disabled={isSending}
            className="rounded-full bg-gray-200 text-gray-500 transition-opacity hover:opacity-100"
          >
            Delete
          </button>
          <span className="animate-pulse text-red-500">{isSending ? "Sending..." : "Recording..."}</span>
          <button
            onClick={pauseResumeRecording}
            disabled={isSending}
            className="rounded-full bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
          >
            {isPaused ? "▶" : "⏸"}
          </button>
          <button
            onClick={sendRecording}
            disabled={isSending}
            className="rounded-lg bg-blue-500 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Sending" : "Send"}
          </button>
        </div>
      )}
    </div>
  )
}

export default AudioRecorder
