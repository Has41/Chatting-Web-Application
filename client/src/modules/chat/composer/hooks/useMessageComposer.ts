import { useEffect, useReducer, useRef, useState, type ChangeEvent } from "react"
import useAuth from "@auth/hooks/useAuth"
import { createTempMessageId } from "@chat/attachments/utils/filePreview"
import { attachmentPickerReducer, initialAttachmentPickerState } from "@chat/composer/state/messageComposerState"
import { createFileSocketData, createOptimisticMessage, getAcceptedTypes } from "@chat/composer/utils/messageComposer"
import type { FileType, SendMessagePayload } from "@chat/attachments/types/attachments"
import type { MessageComposerProps } from "@chat/composer/types/messageComposer"

export const useMessageComposer = ({
  conversationType,
  onTypingStart,
  onTypingStop,
  recipientId,
  sendMessage,
  setMessageContent,
  setMessages,
  socketRef
}: Required<Pick<MessageComposerProps, "conversationType">> & Omit<MessageComposerProps, "conversationType">) => {
  const { user } = useAuth()
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [attachmentPicker, requestAttachmentPicker] = useReducer(attachmentPickerReducer, initialAttachmentPickerState)

  const attachmentType = attachmentPicker.type
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const attachmentTypeRef = useRef<FileType | null>(null)
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
    if (!attachmentPicker.type || attachmentPicker.requestId === 0) return
    fileInputRef.current?.setAttribute("accept", getAcceptedTypes(attachmentPicker.type))
    fileInputRef.current?.click()
  }, [attachmentPicker])

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
    attachmentTypeRef.current = type
    requestAttachmentPicker(type)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    event.target.value = ""
    setPreviewFile(file)
  }

  const handleSendMessage = ({
    conversationId,
    messageContent,
    messageType,
    fileMeta = null,
    clientTempId,
    optimisticOnly = false,
    markFailed = false
  }: SendMessagePayload) => {
    if (!user) return

    if (markFailed && clientTempId) {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === clientTempId && message.localStatus === "sending" ? { ...message, localStatus: "failed" } : message
        )
      )
      return
    }

    if (!messageContent?.trim() && !fileMeta) return

    const resolvedClientTempId = clientTempId ?? createTempMessageId()
    const trimmedContent = messageContent?.trim() || ""
    const fileData = messageType === "file" && fileMeta ? createFileSocketData(fileMeta, attachmentTypeRef.current) : {}
    const messageData = {
      clientTempId: resolvedClientTempId,
      conversationId,
      sender: user._id,
      content: trimmedContent,
      recipient: recipientId,
      messageType,
      conversationType
    }
    const optimisticMessage = createOptimisticMessage({
      clientTempId: resolvedClientTempId,
      conversationId,
      conversationType,
      fileMeta,
      messageContent: trimmedContent,
      messageType,
      recipientId,
      senderId: user._id,
      attachmentType: attachmentTypeRef.current
    })

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
        prev.map((message) => (message._id === resolvedClientTempId ? { ...message, localStatus: "failed" } : message))
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

  return {
    user,
    state: {
      attachmentType,
      isRecording,
      previewFile,
      showAttachmentOptions
    },
    refs: {
      fileInputRef
    },
    handlers: {
      handleAttachmentSelect,
      handleFileChange,
      handleMessageInputChange,
      handleSendMessage,
      setIsRecording,
      setPreviewFile,
      setShowAttachmentOptions
    }
  }
}
