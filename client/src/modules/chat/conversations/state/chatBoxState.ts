import type { ChatMessage } from "@chat/conversations/types/chatMessages"

export interface ChatBoxState {
  userData: any
  lastMessage?: ChatMessage
  messageContent: string
  messages: any[]
  isSidebarOpen: boolean
}

export type ChatBoxAction =
  | { type: "SET_USER_DATA"; payload: any }
  | { type: "SET_LAST_MESSAGE"; payload?: ChatMessage }
  | { type: "SET_MESSAGE_CONTENT"; payload: string }
  | { type: "SET_MESSAGES"; payload: any[] | ((prev: any[]) => any[]) }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; payload: boolean }

export const initialChatBoxState: ChatBoxState = {
  userData: null,
  lastMessage: undefined,
  messageContent: "",
  messages: [],
  isSidebarOpen: false
}

export const chatBoxReducer = (state: ChatBoxState, action: ChatBoxAction): ChatBoxState => {
  switch (action.type) {
    case "SET_USER_DATA":
      return { ...state, userData: action.payload }
    case "SET_LAST_MESSAGE":
      return { ...state, lastMessage: action.payload }
    case "SET_MESSAGE_CONTENT":
      return { ...state, messageContent: action.payload }
    case "SET_MESSAGES": {
      const next = typeof action.payload === "function" ? action.payload(state.messages) : action.payload
      return { ...state, messages: next }
    }
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpen: !state.isSidebarOpen }
    case "SET_SIDEBAR":
      return { ...state, isSidebarOpen: action.payload }
    default:
      return state
  }
}
