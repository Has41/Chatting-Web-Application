import { useEffect, useRef, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { io, Socket } from "socket.io-client"
import { useAuth } from "@auth/hooks/useAuth"
import { useQueryClient } from "@tanstack/react-query"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

export interface TypingUser {
  userId: string
  username?: string
}

export const useChatSocket = (config?: any) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const userId = config?.userId ?? user?._id
  const conversationId = config?.conversationId
  const type = config?.type ?? "private"
  const setMessages = config?.setMessages
  const conversationIdRef = useRef(conversationId)
  const typeRef = useRef(type)
  const setMessagesRef = useRef(setMessages)
  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const mergeIncomingMessage = useCallback((incomingMessage: any) => {
    setMessagesRef.current?.((prev: any[]) => {
      const existingIndex = prev.findIndex(
        (message) =>
          message._id === incomingMessage._id ||
          (incomingMessage.clientTempId && message.clientTempId === incomingMessage.clientTempId)
      )

      if (existingIndex === -1) return [...prev, incomingMessage]

      return prev.map((message, index) =>
        index === existingIndex ? { ...incomingMessage, localStatus: undefined } : message
      )
    })
  }, [])

  const refreshConversationFiles = useCallback(
    (messageData: any, fallbackConversationId?: string) => {
      if (messageData?.messageType !== "file") return

      const fileConversationId =
        fallbackConversationId || messageData?.conversation?._id || messageData?.conversation || conversationIdRef.current

      if (!fileConversationId) return

      queryClient.invalidateQueries({ queryKey: ["conversationFiles", fileConversationId.toString()] })
    },
    [queryClient]
  )

  const mergeReactionUpdate = useCallback(
    (updatedMessage: any) => {
      if (!updatedMessage?._id) return

      setMessagesRef.current?.((prev: any[]) =>
        prev.map((message) => (message._id === updatedMessage._id ? { ...message, ...updatedMessage } : message))
      )

      queryClient.setQueryData(["getUserMessages", conversationIdRef.current], (oldData: any) => {
        if (!oldData?.pages) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((message: any) =>
              message._id === updatedMessage._id ? { ...message, ...updatedMessage } : message
            )
          }))
        }
      })
    },
    [queryClient]
  )

  useEffect(() => {
    conversationIdRef.current = conversationId
    typeRef.current = type
    setMessagesRef.current = setMessages

    if (socketRef.current?.connected && type === "group" && conversationId && userId) {
      socketRef.current.emit("join-group", { conversationId, userId })
    }
  }, [config?.conversationId, config?.setMessages, config?.type, config?.userId, conversationId, setMessages, type, user?._id, userId])

  useEffect(() => {
    if (!userId) return

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true
    })
    socketRef.current = socket

    const handleConnect = () => {
      console.log("Socket connected:", socketRef.current?.id)

      if (typeRef.current === "group" && conversationIdRef.current) {
        socketRef.current?.emit("join-group", { conversationId: conversationIdRef.current, userId })
      }
    }

    const handleDisconnect = () => {
      console.log("Socket disconnected")
    }

    const handleReceiveGroupMessages = (messageData: any, convoId: any) => {
      if (typeRef.current === "group" && convoId?.toString() === conversationIdRef.current?.toString()) {
        mergeIncomingMessage(messageData)
        refreshConversationFiles(messageData, convoId?.toString())
      }
    }

    const handleReceiveMessage = (messageData: any) => {
      if (typeRef.current === "group") return

      if (!conversationIdRef.current && messageData.conversation) {
        navigate(`/chat/conversation/${messageData.conversation}`)
      }

      mergeIncomingMessage(messageData)
      refreshConversationFiles(messageData)
    }

    const handleTypingStart = (typingData: TypingUser & { conversationId?: string; conversationType?: string }) => {
      if (!typingData?.userId || typingData.userId === userId) return

      if (
        typingData.conversationId &&
        conversationIdRef.current &&
        typingData.conversationId.toString() !== conversationIdRef.current.toString()
      ) {
        return
      }

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

    const handleTypingStop = (typingData: TypingUser) => {
      if (!typingData?.userId) return

      window.clearTimeout(typingTimeoutsRef.current[typingData.userId])
      delete typingTimeoutsRef.current[typingData.userId]
      setTypingUsers((prev) => prev.filter((typingUser) => typingUser.userId !== typingData.userId))
    }

    const handleReactionUpdated = (data: { message?: any }) => {
      mergeReactionUpdate(data?.message)
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("receive-group-messages", handleReceiveGroupMessages)
    socket.on("receiveMessage", handleReceiveMessage)
    socket.on("typing:start", handleTypingStart)
    socket.on("typing:stop", handleTypingStop)
    socket.on("message-reaction-updated", handleReactionUpdated)

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("receive-group-messages", handleReceiveGroupMessages)
      socket.off("receiveMessage", handleReceiveMessage)
      socket.off("typing:start", handleTypingStart)
      socket.off("typing:stop", handleTypingStop)
      socket.off("message-reaction-updated", handleReactionUpdated)
      Object.values(typingTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      typingTimeoutsRef.current = {}
      if (socketRef.current === socket) {
        socket.disconnect()
        socketRef.current = null
      }
    }
  }, [config?.userId, mergeIncomingMessage, mergeReactionUpdate, navigate, refreshConversationFiles, user?._id, userId])

  const emit = useCallback((event: string, ...args: unknown[]) => {
    if (socketRef.current) {
      socketRef.current.emit(event, ...args)
    }
  }, [])

  const sendMessage = useCallback((payload: any) => {
    const clientTempId = payload?.messageData?.clientTempId

    socketRef.current?.timeout(15000).emit("sendMessage", payload, (error: Error | null) => {
      if (!error || !clientTempId) return

      setMessagesRef.current?.((prev: any[]) =>
        prev.map((message) =>
          message._id === clientTempId && message.localStatus === "sending"
            ? { ...message, localStatus: "failed" }
            : message
        )
      )
    })
  }, [])

  const reactToMessage = useCallback(
    (payload: { messageId: string; emoji: string }) => {
      const activeUserId = config?.userId ?? user?._id
      if (!activeUserId) return
      socketRef.current?.emit("react-to-message", {
        ...payload,
        userId: activeUserId
      })
    },
    [config?.userId, user?._id]
  )

  const emitTypingStart = useCallback(
    (payload: { conversationId?: string; conversationType: "private" | "group"; recipientId?: string; username?: string }) => {
      const activeUserId = config?.userId ?? user?._id
      if (!activeUserId) return
      socketRef.current?.emit("typing:start", {
        ...payload,
        senderId: activeUserId
      })
    },
    [config?.userId, user?._id]
  )

  const emitTypingStop = useCallback(
    (payload: { conversationId?: string; conversationType: "private" | "group"; recipientId?: string; username?: string }) => {
      const activeUserId = config?.userId ?? user?._id
      if (!activeUserId) return
      socketRef.current?.emit("typing:stop", {
        ...payload,
        senderId: activeUserId
      })
    },
    [config?.userId, user?._id]
  )

  return {
    socket: socketRef.current,
    socketRef,
    sendMessage,
    reactToMessage,
    emitTypingStart,
    emitTypingStop,
    typingUsers,
    emit
  }
}

export default useChatSocket
