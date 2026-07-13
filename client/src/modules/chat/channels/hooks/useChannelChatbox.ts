import { useEffect, useMemo, useRef, useState } from "react"
import { Hash, Lock } from "lucide-react"
import { useParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import useAuth from "@auth/hooks/useAuth"
import { channelKeys, useChannel, useJoinChannel } from "../queries/useChannels"
import { useChannelMessages } from "../queries/useChannelMessages"
import { useChannelSocket } from "./useChannelSocket"
import { useChannelComposer } from "./useChannelComposer"
import type { Channel } from "@shared/types"
import type { ChannelMessage, ChannelMessagesCache } from "../types/channelChat"
import { getChannelUserId } from "../utils/channelChat"
import {
  createChannelMediaGallery,
  findTypingMember,
  flattenChannelMessages,
  mergeChannelMessages
} from "../utils/channelChatView"

export const useChannelChatbox = () => {
  const { channelId } = useParams()
  const { user } = useAuth()
  const [liveMessages, setLiveMessages] = useState<ChannelMessage[]>([])
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  const channelQuery = useChannel(channelId)
  const messagesQuery = useChannelMessages(channelId)
  const joinChannel = useJoinChannel()
  const channel = channelQuery.data as Channel | undefined
  const isChannelMember = Boolean(
    channel && user?._id && channel.members.some((member) => getChannelUserId(member) === user._id)
  )
  const currentUserIsChannelAdmin = Boolean(
    channel &&
    user?._id &&
    (getChannelUserId(channel.owner) === user._id || channel.admins.some((admin) => getChannelUserId(admin) === user._id))
  )
  const canSendInChannel =
    isChannelMember && ((channel?.sendPermissions || "admins") === "members" || currentUserIsChannelAdmin)
  const isPublicPreview = Boolean(channel && channel.visibility === "public" && !isChannelMember)

  const { sendChannelMessage, reactToMessage, typingUsers, emitTypingStart, emitTypingStop } = useChannelSocket({
    channelId,
    userId: user?._id,
    enabled: isChannelMember,
    setMessages: setLiveMessages
  })

  const fetchedMessages = useMemo(() => flattenChannelMessages(messagesQuery.data?.pages), [messagesQuery.data?.pages])
  const messages = useMemo(() => mergeChannelMessages(fetchedMessages, liveMessages), [fetchedMessages, liveMessages])
  const mediaGallery = useMemo(() => createChannelMediaGallery(messages, channel?.name), [channel?.name, messages])
  const typingMember = useMemo(() => findTypingMember(typingUsers, channel), [channel, typingUsers])
  const VisibilityIcon = channel?.visibility === "private" ? Lock : Hash
  const composer = useChannelComposer({
    channelId,
    user,
    canSendInChannel,
    sendChannelMessage,
    emitTypingStart,
    emitTypingStop,
    setLiveMessages
  })

  const updateMessageInCache = (messageId: string, updater: (message: ChannelMessage) => ChannelMessage) => {
    queryClient.setQueryData<ChannelMessagesCache>(channelKeys.messages(channelId), (oldData) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          messages: page.messages.map((message) => (message._id === messageId ? updater(message) : message))
        }))
      }
    })

    setLiveMessages((prev) => prev.map((message) => (message._id === messageId ? updater(message) : message)))
  }

  const removeMessageFromCache = (messageId: string) => {
    queryClient.setQueryData<ChannelMessagesCache>(channelKeys.messages(channelId), (oldData) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          messages: page.messages.filter((message) => message._id !== messageId)
        }))
      }
    })

    setLiveMessages((prev) => prev.filter((message) => message._id !== messageId))
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, typingUsers.length])

  const handleJoinChannel = async () => {
    if (!channelId || joinChannel.isPending) return
    await joinChannel.mutateAsync(channelId)
  }

  return {
    channelId,
    user,
    channel,
    channelQuery,
    messagesQuery,
    joinChannel,
    messages,
    mediaGallery,
    typingUsers,
    typingMember,
    composer,
    bottomRef,
    isInfoOpen,
    VisibilityIcon,
    permissions: {
      isChannelMember,
      canSendInChannel,
      isPublicPreview
    },
    actions: {
      setIsInfoOpen,
      handleJoinChannel,
      updateMessageInCache,
      removeMessageFromCache,
      reactToMessage
    }
  }
}
