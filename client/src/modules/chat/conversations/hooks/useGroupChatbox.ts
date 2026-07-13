import { useEffect, useMemo, useReducer, type SetStateAction } from "react"
import { useParams } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"
import useChatSocket from "@chat/socket/useChatSocket"
import { useGroupConversationQuery } from "@chat/conversations/queries/chatQueries"
import { groupChatboxReducer, initialGroupChatboxState } from "@chat/conversations/state/groupChatboxState"
import { mergeGroupConversationData } from "@chat/conversations/utils/groupChatbox"
import type { Conversation } from "@shared/types"
import type { ChatMessage } from "@chat/conversations/types/chatMessages"

export const useGroupChatbox = () => {
  const { user } = useAuth()
  const { conversationId } = useParams()
  const [state, dispatch] = useReducer(groupChatboxReducer, initialGroupChatboxState)

  const setMessages = (payload: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) =>
    dispatch({ type: "SET_MESSAGES", payload })

  const socket = useChatSocket({
    userId: user?._id,
    conversationId,
    setMessages,
    type: "group"
  })

  const { data: groupResponse, error: groupError } = useGroupConversationQuery({
    conversationId,
    enabled: Boolean(user && conversationId)
  })

  useEffect(() => {
    if (!groupError) return
    console.error("Failed to load group:", groupError)
  }, [groupError])

  const serverGroupData = groupResponse?.conversation ?? null
  const groupData = useMemo(
    () =>
      mergeGroupConversationData({
        serverGroupData,
        groupOverride: state.groupOverride
      }),
    [serverGroupData, state.groupOverride]
  )

  const setGroupData = (value: SetStateAction<Conversation | null>) =>
    dispatch({ type: "SET_GROUP_OVERRIDE", payload: value, fallback: serverGroupData })

  const emitGroupTypingStart = () => {
    if (!user) return
    socket.emitTypingStart({
      conversationId,
      conversationType: "group",
      username: user.username
    })
  }

  const emitGroupTypingStop = () => {
    if (!user) return
    socket.emitTypingStop({
      conversationId,
      conversationType: "group",
      username: user.username
    })
  }

  return {
    user,
    conversationId,
    state,
    groupData,
    lastMessage: groupData?.lastMessage as ChatMessage | undefined,
    socket,
    setMessages,
    setGroupData,
    handlers: {
      toggleSidebar: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
      closeSidebar: () => dispatch({ type: "SET_SIDEBAR", payload: false }),
      setMessageContent: (value: string) => dispatch({ type: "SET_MESSAGE_CONTENT", payload: value }),
      emitGroupTypingStart,
      emitGroupTypingStop
    }
  }
}
