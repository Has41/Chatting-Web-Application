import { useCallback, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query"
import type { Message } from "@shared/types"
import { channelKeys } from "../queries/useChannels"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

interface UseChannelSocketConfig {
  channelId?: string
  userId?: string
  enabled?: boolean
  setMessages: (value: Message[] | ((prev: Message[]) => Message[])) => void
}

export interface ChannelTypingUser {
  userId: string
  username?: string
}

export const useChannelSocket = ({ channelId, userId, enabled = true, setMessages }: UseChannelSocketConfig) => {
  const socketRef = useRef<Socket | null>(null)
  const [typingUsers, setTypingUsers] = useState<ChannelTypingUser[]>([])
  const channelIdRef = useRef(channelId)
  const setMessagesRef = useRef(setMessages)
  const typingTimeoutsRef = useRef<Record<string, number>>({})
  const queryClient = useQueryClient()

  useEffect(() => {
    channelIdRef.current = channelId
    setMessagesRef.current = setMessages

    if (socketRef.current?.connected && channelId && userId && enabled) {
      socketRef.current.emit("join-channel", { channelId, userId })
    }
  }, [channelId, enabled, setMessages, userId])

  const mergeIncomingMessage = useCallback((incomingMessage: Message & { clientTempId?: string }) => {
    setMessagesRef.current((prev) => {
      const existingIndex = prev.findIndex(
        (message: any) =>
          message._id === incomingMessage._id ||
          (incomingMessage.clientTempId && message.clientTempId === incomingMessage.clientTempId)
      )

      if (existingIndex === -1) return [...prev, incomingMessage]

      return prev.map((message, index) =>
        index === existingIndex ? { ...incomingMessage, localStatus: undefined } : message
      )
    })
  }, [])

  const mergeReactionUpdate = useCallback(
    (updatedMessage: Message) => {
      if (!updatedMessage?._id) return

      const mergeMessage = (message: Message) => {
        const nextSender = typeof updatedMessage.sender === "string" ? message.sender : updatedMessage.sender

        return {
          ...message,
          ...updatedMessage,
          sender: nextSender
        }
      }

      setMessagesRef.current((prev) =>
        prev.map((message: any) =>
          message._id === updatedMessage._id ? mergeMessage(message) : message
        )
      )

      queryClient.setQueryData(channelKeys.messages(channelIdRef.current), (oldData: any) => {
        if (!oldData?.pages) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((message: Message) =>
              message._id === updatedMessage._id ? mergeMessage(message) : message
            )
          }))
        }
      })
    },
    [queryClient]
  )

  useEffect(() => {
    if (!userId || !enabled) return

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true
    })
    socketRef.current = socket

    const handleConnect = () => {
      if (channelIdRef.current) {
        socketRef.current?.emit("join-channel", { channelId: channelIdRef.current, userId })
      }
    }

    const handleReceiveChannelMessage = (messageData: Message & { channel?: string; clientTempId?: string }) => {
      if (messageData.channel?.toString() !== channelIdRef.current?.toString()) return
      mergeIncomingMessage(messageData)
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelIdRef.current) })
      if (messageData.messageType === "file") {
        queryClient.invalidateQueries({ queryKey: channelKeys.files(channelIdRef.current) })
      }
    }

    const handleTypingStart = (typingData: ChannelTypingUser & { conversationId?: string; conversationType?: string }) => {
      if (!typingData?.userId || typingData.userId === userId) return
      if (typingData.conversationType !== "channel") return
      if (typingData.conversationId?.toString() !== channelIdRef.current?.toString()) return

      window.clearTimeout(typingTimeoutsRef.current[typingData.userId])
      setTypingUsers((prev) => {
        if (prev.some((typingUser) => typingUser.userId === typingData.userId)) return prev
        return [...prev, { userId: typingData.userId, username: typingData.username }]
      })

      typingTimeoutsRef.current[typingData.userId] = window.setTimeout(() => {
        setTypingUsers((prev) => prev.filter((typingUser) => typingUser.userId !== typingData.userId))
        delete typingTimeoutsRef.current[typingData.userId]
      }, 3000)
    }

    const handleTypingStop = (typingData: ChannelTypingUser & { conversationId?: string }) => {
      if (!typingData?.userId) return
      if (typingData.conversationId?.toString() !== channelIdRef.current?.toString()) return

      window.clearTimeout(typingTimeoutsRef.current[typingData.userId])
      delete typingTimeoutsRef.current[typingData.userId]
      setTypingUsers((prev) => prev.filter((typingUser) => typingUser.userId !== typingData.userId))
    }

    const handleChannelMessageError = () => {
      setMessagesRef.current((prev) =>
        prev.map((message: any) =>
          message.localStatus === "sending" ? { ...message, localStatus: "failed" } : message
        )
      )
    }

    const handleReactionUpdated = (data: { message?: Message }) => {
      const updatedMessage = data?.message
      if (!updatedMessage || updatedMessage.channel?.toString() !== channelIdRef.current?.toString()) return
      mergeReactionUpdate(updatedMessage)
    }

    socket.on("connect", handleConnect)
    socket.on("receive-channel-message", handleReceiveChannelMessage)
    socket.on("typing:start", handleTypingStart)
    socket.on("typing:stop", handleTypingStop)
    socket.on("channel-message-error", handleChannelMessageError)
    socket.on("message-reaction-updated", handleReactionUpdated)

    return () => {
      socket.off("connect", handleConnect)
      socket.off("receive-channel-message", handleReceiveChannelMessage)
      socket.off("typing:start", handleTypingStart)
      socket.off("typing:stop", handleTypingStop)
      socket.off("channel-message-error", handleChannelMessageError)
      socket.off("message-reaction-updated", handleReactionUpdated)
      Object.values(typingTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      typingTimeoutsRef.current = {}
      if (channelIdRef.current) {
        socket.emit("leave-channel", { channelId: channelIdRef.current })
      }
      if (socketRef.current === socket) {
        socket.disconnect()
        socketRef.current = null
      }
    }
  }, [enabled, mergeIncomingMessage, mergeReactionUpdate, queryClient, userId])

  const sendChannelMessage = useCallback(
    (payload: {
      channelId: string
      sender: string
      content?: string
      messageType: "text" | "file"
      fileData?: any
      clientTempId?: string
    }) => {
      socketRef.current?.emit("send-channel-message", payload)
    },
    []
  )

  const reactToMessage = useCallback(
    (payload: { messageId: string; emoji: string }) => {
      if (!userId) return
      socketRef.current?.emit("react-to-message", {
        ...payload,
        userId
      })
    },
    [userId]
  )

  const emitTypingStart = useCallback(
    (payload: { channelId: string; username?: string }) => {
      if (!userId) return
      socketRef.current?.emit("typing:start", {
        conversationId: payload.channelId,
        conversationType: "channel",
        senderId: userId,
        username: payload.username
      })
    },
    [userId]
  )

  const emitTypingStop = useCallback(
    (payload: { channelId: string; username?: string }) => {
      if (!userId) return
      socketRef.current?.emit("typing:stop", {
        conversationId: payload.channelId,
        conversationType: "channel",
        senderId: userId,
        username: payload.username
      })
    },
    [userId]
  )

  return {
    socketRef,
    sendChannelMessage,
    reactToMessage,
    typingUsers,
    emitTypingStart,
    emitTypingStop
  }
}

export default useChannelSocket
