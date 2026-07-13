import type { User } from "@shared/types"
import type { FileType } from "@chat/attachments/types/attachments"
import type { ChannelMessage } from "../types/channelChat"

export const getSender = (sender: string | User): User | null => (typeof sender === "string" ? null : sender)

export const getSenderId = (sender: string | User): string => (typeof sender === "string" ? sender : sender._id)

export const getChannelUserId = (value?: string | User | null) => (typeof value === "string" ? value : value?._id)

export const getAvatarUrl = (user?: User | null) => user?.profilePicture?.url || user?.avatar || ""

export const createTempMessageId = () => `temp-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`

export const getAcceptedTypes = (type: FileType | null) => {
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

export const applyChannelReaction = (
  targetMessage: ChannelMessage,
  emoji: string,
  currentUserId: string
): ChannelMessage => {
  const reactions = targetMessage.reactions ?? []
  const existingReaction = reactions.find((reaction) => {
    const reactionUserId = typeof reaction.user === "string" ? reaction.user : reaction.user?._id
    return reactionUserId === currentUserId || reaction.users?.includes(currentUserId)
  })
  const reactionsWithoutMine = reactions.reduce<typeof reactions>((nextReactions, reaction) => {
    const nextReaction = reaction.users?.includes(currentUserId)
      ? { ...reaction, users: reaction.users.filter((reactionUserId) => reactionUserId !== currentUserId) }
      : reaction
    const reactionUserId = typeof reaction.user === "string" ? reaction.user : reaction.user?._id
    const hasGroupedUsers = !nextReaction.users || nextReaction.users.length > 0

    if (reactionUserId !== currentUserId && hasGroupedUsers) {
      nextReactions.push(nextReaction)
    }

    return nextReactions
  }, [])

  const nextReactions =
    existingReaction?.emoji === emoji ? reactionsWithoutMine : [...reactionsWithoutMine, { user: currentUserId, emoji }]

  return { ...targetMessage, reactions: nextReactions }
}
