import type { Channel, Message, User } from "@shared/types"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import type { ChannelTypingUser } from "../hooks/useChannelSocket"
import type { ChannelMessage } from "../types/channelChat"

export const mergeChannelMessages = (fetchedMessages: ChannelMessage[], liveMessages: ChannelMessage[]) => {
  const byId = new Map<string, ChannelMessage>()

  const addMessage = (message: ChannelMessage) => {
    const stableKey = message.clientTempId || message._id
    const existingKey = Array.from(byId.entries()).find(
      ([, value]) => value._id === message._id || (message.clientTempId && value.clientTempId === message.clientTempId)
    )?.[0]

    if (existingKey) {
      byId.set(existingKey, { ...byId.get(existingKey), ...message })
      return
    }

    byId.set(stableKey, message)
  }

  fetchedMessages.forEach(addMessage)
  liveMessages.forEach(addMessage)

  return Array.from(byId.values()).sort(
    (first, second) => new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  )
}

export const flattenChannelMessages = (pages?: Array<{ messages: Message[] }>) =>
  pages?.flatMap((page) => page.messages as ChannelMessage[]) ?? []

export const createChannelMediaGallery = (messages: ChannelMessage[], channelName?: string): MediaViewerItem[] =>
  messages.reduce<MediaViewerItem[]>((items, message) => {
    const mediaType = message.media?.mediaType
    if (message.messageType !== "file" || !message.media?.mediaUrl || (mediaType !== "image" && mediaType !== "video")) {
      return items
    }

    items.push({
      mediaUrl: message.media.mediaUrl,
      mediaType,
      title: message.media.caption || message.media.fileName || channelName
    })
    return items
  }, [])

export const findTypingMember = (typingUsers: ChannelTypingUser[], channel?: Channel): User | null => {
  const typingUserId = typingUsers[0]?.userId
  if (!typingUserId || !channel) return null

  const member = channel.members.find(
    (channelMember) => typeof channelMember !== "string" && channelMember._id === typingUserId
  )

  return typeof member === "string" ? null : (member ?? null)
}
