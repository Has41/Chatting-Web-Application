import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { Send } from "lucide-react"
import AttachmentMenu from "@chat/composer/components/AttachmentMenu"
import FilePreviewModal from "@chat/attachments/components/FilePreviewModal"
import useAuth from "@auth/hooks/useAuth"
import AudioRecorder from "@chat/composer/components/AudioRecorder"
import type { ConversationType, FileType, MessageFileMeta } from "@chat/attachments/types/attachments"

const createTempMessageId = () => `temp-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`

const getAcceptedTypes = (type: FileType | null) => {
  switch (type) {
    case "image":
      return "image/*"
    case "video":
      return "video/*"
    case "document":
      return ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
    case "audio":
      return "audio/*"
    default:
      return "*"
  }
}

interface SendMessageProps {
  setMessageContent: (value: string) => void
  messageContent: string
  recipientId?: string
  socketRef: any
  conversationType?: ConversationType
  conversationId?: string
  sendMessage: (payload: any) => void
  setMessages: (value: any[] | ((prev: any[]) => any[])) => void
  onTypingStart?: () => void
  onTypingStop?: () => void
}

const SendMessage = ({
  setMessageContent,
  messageContent,
  recipientId,
  socketRef,
  conversationType = "private",
  conversationId,
  sendMessage,
  setMessages,
  onTypingStart,
  onTypingStop
}: SendMessageProps) => {
  const { user } = useAuth()
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [attachmentType, setAttachmentType] = useState<FileType | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const lastTypingPulseRef = useRef(0)
  const onTypingStartRef = useRef(onTypingStart)
  const onTypingStopRef = useRef(onTypingStop)

  useEffect(() => {
    onTypingStartRef.current = onTypingStart
    onTypingStopRef.current = onTypingStop
  }, [onTypingStart, onTypingStop])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      if (isTypingRef.current) {
        onTypingStopRef.current?.()
      }
    }
  }, [])

  if (!user) return null

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    if (!isTypingRef.current) return

    isTypingRef.current = false
    onTypingStopRef.current?.()
  }

  const handleAttachmentSelect = (type: FileType) => {
    setAttachmentType(type)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewFile(file)
    // handleSendFile({ type: attachmentType, file })
    e.target.value = ""
  }

  const handleSendMessage = ({
    conversationId,
    messageContent,
    messageType,
    fileMeta = null,
    clientTempId,
    optimisticOnly = false,
    markFailed = false
  }: {
    conversationId?: string
    messageContent?: string
    messageType: "text" | "file"
    fileMeta?: MessageFileMeta | null
    clientTempId?: string
    optimisticOnly?: boolean
    markFailed?: boolean
  }) => {
    // console.log(conversationId)

    if (markFailed && clientTempId) {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === clientTempId && message.localStatus === "sending"
            ? { ...message, localStatus: "failed" }
            : message
        )
      )
      return
    }

    if (!messageContent?.trim() && !fileMeta) return

    const resolvedClientTempId = clientTempId ?? createTempMessageId()
    const trimmedContent = messageContent?.trim() || ""
    let fileData = {}

    const messageData = {
      clientTempId: resolvedClientTempId,
      conversationId,
      sender: user._id,
      content: trimmedContent,
      recipient: recipientId,
      messageType,
      conversationType
    }

    if (messageType === "file" && fileMeta) {
      fileData = {
        publicId: fileMeta.public_url,
        url: fileMeta.media_url,
        caption: fileMeta.caption || "",
        thumbnailUrl: fileMeta.thumbnailUrl || "",
        mediaType: fileMeta.mediaType || attachmentType || "",
        mimeType: fileMeta.mimeType || "",
        fileName: fileMeta.fileName || ""
      }
    }

    const optimisticMessage = {
      _id: resolvedClientTempId,
      clientTempId: resolvedClientTempId,
      conversation: conversationId,
      conversationId,
      sender: user._id,
      recipient: recipientId,
      content: trimmedContent,
      messageType,
      conversationType,
      media:
        messageType === "file" && fileMeta
          ? {
              publicId: fileMeta.public_url,
              mediaUrl: fileMeta.media_url,
              caption: fileMeta.caption || "",
              thumbnailUrl: fileMeta.thumbnailUrl || "",
              mediaType: fileMeta.mediaType || attachmentType || "",
              mimeType: fileMeta.mimeType || "",
              fileName: fileMeta.fileName || ""
            }
          : undefined,
      seenBy: [],
      createdAt: new Date().toISOString(),
      localStatus: "sending"
    }

    setMessages((prev) => {
      const existingIndex = prev.findIndex((message) => message._id === resolvedClientTempId)
      if (existingIndex === -1) return [...prev, optimisticMessage]

      return prev.map((message) =>
        message._id === resolvedClientTempId
          ? {
              ...message,
              content: optimisticMessage.content,
              media: optimisticMessage.media,
              localStatus: "sending"
            }
          : message
      )
    })

    if (optimisticOnly) return

    if (socketRef.current) {
      sendMessage({ messageData, fileData })
    } else {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === resolvedClientTempId ? { ...message, localStatus: "failed" } : message
        )
      )
    }
    setMessageContent("")
    stopTyping()
  }

  const handleMessageInputChange = (value: string) => {
    setMessageContent(value)

    if (!value.trim()) {
      stopTyping()
      return
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true
      lastTypingPulseRef.current = Date.now()
      onTypingStartRef.current?.()
    } else if (Date.now() - lastTypingPulseRef.current > 1200) {
      lastTypingPulseRef.current = Date.now()
      onTypingStartRef.current?.()
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 2200)
  }

  return (
    <div className="relative flex max-w-full items-center gap-3 border-t p-4">
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          type={attachmentType ?? "document"}
          recipientId={recipientId}
          conversationId={conversationId}
          conversationType={conversationType}
          onSend={handleSendMessage}
          onCancel={() => setPreviewFile(null)}
        />
      )}
      {/* Audio icon */}
      <div className={`${isRecording ? "w-[30%]" : "w-[5%]"}`}>
        <AudioRecorder
          onSend={handleSendMessage}
          isRecording={isRecording}
          conversationType={conversationType}
          setIsRecording={setIsRecording}
          recipientId={recipientId}
          conversationId={conversationId}
        />
      </div>
      {!isRecording && (
        <input
          type="text"
          placeholder="Type a message..."
          className="w-3/4 rounded-md border border-slate-200 p-3 text-sm focus:outline-none"
          value={messageContent}
          onChange={(e) => handleMessageInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage({
                conversationId,
                messageContent,
                messageType: "text"
              })
            }
          }}
        />
      )}
      {!isRecording && (
        <div className="flex w-1/6 gap-x-1">
          {showAttachmentOptions && (
            <AttachmentMenu
              onSelect={(type) => {
                handleAttachmentSelect(type)
                setShowAttachmentOptions(false)
              }}
              onClose={() => setShowAttachmentOptions(false)}
            />
          )}
          {/* File icon */}
          <button
            type="button"
            onClick={() => setShowAttachmentOptions((prev) => !prev)}
            className="hover:text-custom-text rounded-full p-3 text-black/80 transition-all duration-500"
            aria-label="Add attachment"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={getAcceptedTypes(attachmentType)}
              onChange={handleFileChange}
            />

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
                d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
              />
            </svg>
          </button>
          {/* Emoji icon */}
          <button
            type="button"
            className="hover:text-custom-text rounded-full p-3 text-black/80 transition-all duration-500"
            aria-label="Open emoji picker"
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
                d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage({ conversationId, messageContent, messageType: "text" })}
            className="bg-custom-green rounded-full p-3 text-white transition-all duration-500 hover:bg-green-400"
            aria-label="Send message"
          >
            <Send className="size-6" strokeWidth={1.8} />
          </button>
        </div>
      )}
    </div>
  )
}

export default SendMessage
