import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useReducer,
  useRef,
  useState
} from "react"
import type { User } from "@shared/types"
import type { FileType, SendMessagePayload } from "@chat/attachments/types/attachments"
import type { SendChannelMessagePayload } from "./useChannelSocket"
import type { ChannelMessage } from "../types/channelChat"
import { createTempMessageId, getAcceptedTypes } from "../utils/channelChat"
import { attachmentPickerReducer, initialAttachmentPickerState } from "../state/channelComposerState"

interface UseChannelComposerOptions {
  channelId?: string
  user?: User | null
  canSendInChannel: boolean
  sendChannelMessage: (payload: SendChannelMessagePayload) => void
  emitTypingStart: (payload: { channelId: string; username?: string }) => void
  emitTypingStop: (payload: { channelId: string; username?: string }) => void
  setLiveMessages: Dispatch<SetStateAction<ChannelMessage[]>>
}

export const useChannelComposer = ({
  channelId,
  user,
  canSendInChannel,
  sendChannelMessage,
  emitTypingStart,
  emitTypingStop,
  setLiveMessages
}: UseChannelComposerOptions) => {
  const [messageText, updateMessageText] = useReducer((_current: string, value: string) => value, "")
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [attachmentPicker, requestAttachmentPicker] = useReducer(attachmentPickerReducer, initialAttachmentPickerState)
  const attachmentType = attachmentPicker.type
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const attachmentTypeRef = useRef<FileType | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const lastTypingPulseRef = useRef(0)

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    if (!isTypingRef.current || !channelId) return

    isTypingRef.current = false
    emitTypingStop({ channelId, username: user?.username })
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      if (isTypingRef.current && channelId) {
        emitTypingStop({ channelId, username: user?.username })
      }
    }
  }, [channelId, emitTypingStop, user?.username])

  useEffect(() => {
    if (!attachmentPicker.type || attachmentPicker.requestId === 0) return
    fileInputRef.current?.setAttribute("accept", getAcceptedTypes(attachmentPicker.type))
    fileInputRef.current?.click()
  }, [attachmentPicker])

  const handleMessageInputChange = (value: string) => {
    if (!canSendInChannel) return

    if (!value.trim() || !channelId) {
      stopTyping()
      updateMessageText(value)
      return
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true
      lastTypingPulseRef.current = Date.now()
      emitTypingStart({ channelId, username: user?.username })
    } else if (Date.now() - lastTypingPulseRef.current > 1200) {
      lastTypingPulseRef.current = Date.now()
      emitTypingStart({ channelId, username: user?.username })
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 2200)

    updateMessageText(value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = messageText.trim()
    if (!content || !channelId || !user?._id || !canSendInChannel) return

    const clientTempId = createTempMessageId()
    const optimisticMessage: ChannelMessage = {
      _id: clientTempId,
      conversationId: channelId,
      channel: channelId,
      sender: user,
      content,
      messageType: "text",
      clientTempId,
      localStatus: "sending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLiveMessages((prev) => [...prev, optimisticMessage])
    updateMessageText("")
    stopTyping()
    sendChannelMessage({
      channelId,
      sender: user._id,
      content,
      messageType: "text",
      clientTempId
    })
  }

  const handleAttachmentSelect = (type: FileType) => {
    if (!canSendInChannel) return

    attachmentTypeRef.current = type
    requestAttachmentPicker(type)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canSendInChannel) {
      event.target.value = ""
      return
    }

    const file = event.target.files?.[0]
    if (!file) return

    event.target.value = ""
    setPreviewFile(file)
  }

  const handleSendFile = ({
    fileMeta = null,
    clientTempId,
    optimisticOnly = false,
    markFailed = false
  }: SendMessagePayload) => {
    if (!channelId || !user?._id || !clientTempId || !canSendInChannel) return

    if (markFailed) {
      setLiveMessages((prev) =>
        prev.map((message) =>
          message.clientTempId === clientTempId || message._id === clientTempId
            ? { ...message, localStatus: "failed" }
            : message
        )
      )
      return
    }

    if (!fileMeta) return

    const optimisticMessage: ChannelMessage = {
      _id: clientTempId,
      conversationId: channelId,
      channel: channelId,
      sender: user,
      content: "",
      messageType: "file",
      clientTempId,
      localStatus: "sending",
      media: {
        publicId: fileMeta.public_url,
        mediaUrl: fileMeta.media_url,
        caption: fileMeta.caption || "",
        thumbnailUrl: fileMeta.thumbnailUrl || "",
        mediaType: fileMeta.mediaType || attachmentTypeRef.current || undefined,
        mimeType: fileMeta.mimeType || "",
        fileName: fileMeta.fileName || ""
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLiveMessages((prev) => {
      const existingIndex = prev.findIndex(
        (message) => message.clientTempId === clientTempId || message._id === clientTempId
      )
      if (existingIndex === -1) return [...prev, optimisticMessage]

      return prev.map((message, index) =>
        index === existingIndex
          ? {
              ...message,
              media: optimisticMessage.media,
              localStatus: "sending"
            }
          : message
      )
    })

    if (optimisticOnly) return

    sendChannelMessage({
      channelId,
      sender: user._id,
      messageType: "file",
      fileData: {
        publicId: fileMeta.public_url,
        url: fileMeta.media_url,
        caption: fileMeta.caption || "",
        thumbnailUrl: fileMeta.thumbnailUrl || "",
        mediaType: fileMeta.mediaType || attachmentTypeRef.current || undefined,
        mimeType: fileMeta.mimeType || "",
        fileName: fileMeta.fileName || ""
      },
      clientTempId
    })
  }

  return {
    messageText,
    attachmentType,
    previewFile,
    showAttachmentOptions,
    fileInputRef,
    setPreviewFile,
    setShowAttachmentOptions,
    handleSubmit,
    handleMessageInputChange,
    handleFileChange,
    handleSendFile,
    handleAttachmentSelect
  }
}
