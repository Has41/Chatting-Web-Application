import type { SetStateAction } from "react"
import type { Conversation } from "@shared/types"
import type { ChatMessage } from "@chat/conversations/types/chatMessages"

export interface GroupChatboxState {
  messages: ChatMessage[]
  messageContent: string
  groupOverride: Conversation | null
  isSidebarOpen: boolean
}

export type GroupChatboxAction =
  | { type: "SET_MESSAGES"; payload: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]) }
  | { type: "SET_MESSAGE_CONTENT"; payload: string }
  | { type: "SET_GROUP_OVERRIDE"; payload: SetStateAction<Conversation | null>; fallback: Conversation | null }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; payload: boolean }

export const initialGroupChatboxState: GroupChatboxState = {
  messages: [],
  messageContent: "",
  groupOverride: null,
  isSidebarOpen: false
}

export const groupChatboxReducer = (
  state: GroupChatboxState,
  action: GroupChatboxAction
): GroupChatboxState => {
  switch (action.type) {
    case "SET_MESSAGES": {
      const nextMessages = typeof action.payload === "function" ? action.payload(state.messages) : action.payload
      return { ...state, messages: nextMessages }
    }
    case "SET_MESSAGE_CONTENT":
      return { ...state, messageContent: action.payload }
    case "SET_GROUP_OVERRIDE": {
      const nextGroup =
        typeof action.payload === "function" ? action.payload(state.groupOverride ?? action.fallback) : action.payload
      return { ...state, groupOverride: nextGroup }
    }
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpen: !state.isSidebarOpen }
    case "SET_SIDEBAR":
      return { ...state, isSidebarOpen: action.payload }
    default:
      return state
  }
}
