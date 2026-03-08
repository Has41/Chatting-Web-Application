import { useEffect, useRef, useState } from "react"
import useCloudinaryUpload from "@shared/hooks/useCloudinaryUpload"
import { ROOT_FOLDER } from "@shared/constants/constantValues"
import useAuth from "@auth/hooks/useAuth"

const AudioRecorder = ({ onSend, isRecording, setIsRecording, recipientId, conversationId, conversationType }) => {
  const { uploadFile } = useCloudinaryUpload()
  const { user } = useAuth()
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const chunksRef = useRef([])

  const MAX_DURATION = 2 * 60 * 1000 // 2 minutes in ms
  let stopTimeout = null

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const file = new File(chunksRef.current, "recording.webm", {
          type: "audio/webm"
        })
        setAudioURL(file)
        chunksRef.current = []
        stream.getTracks().forEach((track) => track.stop())

        if (stopTimeout) {
          clearTimeout(stopTimeout)
          stopTimeout = null
        }
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)

      // auto-stop after 2 minutes
      stopTimeout = setTimeout(() => {
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
        mediaRecorder.stop()
      }
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      setAudioURL(null)
      chunksRef.current = []
    }
  }

  const sendRecording = async () => {
    if (!audioURL) {
      console.log("Audio file not available!")
      return
    }

    if (mediaRecorder) {
      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop()
      }
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
    }

    const res = await uploadFile(
      audioURL,
      conversationType === "private"
        ? `${ROOT_FOLDER}/${user?._id}/chat-uploads/chat-with-${recipientId}`
        : `${ROOT_FOLDER}/${user?._id}/chat-uploads/group-${conversationId}`,
      audioURL.type,
      "audio"
    )

    if (res.secure_url) {
      const fileMeta = {
        public_url: res?.public_id,
        media_url: res?.secure_url
      }
      console.log("Lets audiooo")

      onSend({
        messageType: "file",
        fileMeta,
        conversationId
      })
    }

    setIsRecording(false)
    setIsPaused(false)
    setAudioURL(null)
    chunksRef.current = []
  }

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop()
        }
        mediaRecorder.stream.getTracks().forEach((track) => track.stop())
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
            className="rounded-full bg-gray-200 text-gray-500 transition-opacity hover:opacity-100"
          >
            Delete
          </button>
          <span className="animate-pulse text-red-500">Recording...</span>
          <button
            onClick={pauseResumeRecording}
            className="rounded-full bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
          >
            {isPaused ? "▶" : "⏸"}
          </button>
          <button onClick={sendRecording} className="rounded-lg bg-blue-500 px-3 py-1 text-white">
            Send
          </button>
        </div>
      )}
    </div>
  )
}

export default AudioRecorder
