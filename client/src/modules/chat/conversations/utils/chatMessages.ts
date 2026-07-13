import resolveFilePreviewType from "@shared/utils/resolveFilePreviewType"
import getGroupRecipients from "@shared/utils/getGroupRecipients"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import type { TypingUser } from "@chat/socket/useChatSocket"
import type { User } from "@shared/types"
import type { ChatConversationType, ChatMessage, ChatParticipant } from "@chat/conversations/types/chatMessages"

interface GroupData {
  participants?: (User | string)[]
  groupOwner?: string | User
}

interface MediaGalleryResult {
  mediaGallery: MediaViewerItem[]
  mediaGalleryIndexByMessageId: Map<string, number>
}

export const getMessageSenderId = (message: ChatMessage) =>
  typeof message.sender === "string" ? message.sender : message.sender?._id

export const mergeConversationMessages = (fetchedMessages: ChatMessage[], socketMessages: ChatMessage[]) => {
  const messageMap = new Map<string, ChatMessage>()

  fetchedMessages.forEach((message) => messageMap.set(message._id, message))
  socketMessages.forEach((message) => messageMap.set(message._id, message))

  return Array.from(messageMap.values()).sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
}

export const buildMessageMediaGallery = (messages: ChatMessage[]): MediaGalleryResult => {
  const mediaGallery: MediaViewerItem[] = []
  const mediaGalleryIndexByMessageId = new Map<string, number>()

  messages.forEach((message) => {
    const media = message.media
    const mediaUrl = media?.mediaUrl
    if (message.messageType !== "file" || !mediaUrl) return

    const mediaType = resolveFilePreviewType({
      mediaType: media.mediaType,
      mimeType: media.mimeType,
      fileName: media.fileName,
      mediaUrl
    })

    if (mediaType !== "image" && mediaType !== "video") return

    mediaGalleryIndexByMessageId.set(message._id, mediaGallery.length)
    mediaGallery.push({
      mediaUrl,
      mediaType,
      title: media.caption || media.fileName || mediaUrl.split("?")[0]?.split("/").pop() || "Media"
    })
  })

  return { mediaGallery, mediaGalleryIndexByMessageId }
}

export const getConversationRecipients = (
  conversationType: ChatConversationType | undefined,
  userData: unknown,
  currentUserId: string
) => (conversationType === "group" ? getGroupRecipients(userData as GroupData | null, currentUserId) : [])

export const getTypingProfile = ({
  conversationType,
  groupRecipients,
  typingUser,
  userData
}: {
  conversationType?: ChatConversationType
  groupRecipients: ChatParticipant[]
  typingUser?: TypingUser
  userData: User | null | undefined
}) => (conversationType === "group" ? groupRecipients.find((recipient) => recipient._id === typingUser?.userId) : userData)
