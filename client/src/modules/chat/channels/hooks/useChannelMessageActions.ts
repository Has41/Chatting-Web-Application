import { useState } from "react"
import { useDeleteChannelMessageMutation, useEditChannelMessageMutation } from "../queries/useChannelMessageMutations"
import type { ChannelMessage } from "../types/channelChat"
import { applyChannelReaction } from "../utils/channelChat"

interface UseChannelMessageActionsOptions {
  message: ChannelMessage
  channelId: string
  currentUserId?: string
  canReact: boolean
  isFileMessage: boolean
  onUpdateMessage: (messageId: string, updater: (message: ChannelMessage) => ChannelMessage) => void
  onRemoveMessage: (messageId: string) => void
  onReactToMessage: (payload: { messageId: string; emoji: string }) => void
}

export const useChannelMessageActions = ({
  message,
  channelId,
  currentUserId,
  canReact,
  isFileMessage,
  onUpdateMessage,
  onRemoveMessage,
  onReactToMessage
}: UseChannelMessageActionsOptions) => {
  const [showActions, setShowActions] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editContent, setEditContent] = useState(isFileMessage ? (message.media?.caption ?? "") : (message.content ?? ""))
  const editMessage = useEditChannelMessageMutation(channelId)
  const deleteMessage = useDeleteChannelMessageMutation(channelId)

  const handleEditMessage = (payload: { messageId: string; content: string; field?: "content" | "caption" }) => {
    const { messageId, content, field = "content" } = payload
    onUpdateMessage(messageId, (currentMessage) => ({
      ...currentMessage,
      content: field === "content" ? content : currentMessage.content,
      media: field === "caption" ? { ...currentMessage.media, caption: content } : currentMessage.media,
      editedAt: new Date().toISOString()
    }))
    setShowActions(false)
    editMessage.mutate(payload)
  }

  const handleDeleteMessage = () => {
    onRemoveMessage(message._id)
    setShowActions(false)
    deleteMessage.mutate(message._id)
  }

  const openEditModal = () => {
    setEditContent(isFileMessage ? (message.media?.caption ?? "") : (message.content ?? ""))
    setShowEditModal(true)
    setShowActions(false)
  }

  const handleReact = (emoji: string) => {
    if (!canReact || !currentUserId) return

    onUpdateMessage(message._id, (currentMessage) => applyChannelReaction(currentMessage, emoji, currentUserId))
    onReactToMessage({ messageId: message._id, emoji })
  }

  return {
    state: {
      showActions,
      showEditModal,
      editContent,
      isUpdating: editMessage.isPending || deleteMessage.isPending
    },
    handlers: {
      setEditContent,
      setShowEditModal,
      toggleActions: () => setShowActions((isOpen) => !isOpen),
      openEditModal,
      deleteMessage: handleDeleteMessage,
      editMessage: handleEditMessage,
      handleReact
    }
  }
}
