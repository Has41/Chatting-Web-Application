// @ts-nocheck
import { createContext, ReactNode, useEffect, useReducer } from "react"
import type { Conversation } from "@shared/types"
import { useChatListQuery } from "@chat/queries/chatQueries"

interface ChatContextType {
  chatList: Conversation[]
  setChatList: (chatList: Conversation[]) => void
  isLoading: boolean
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}

interface ChatState {
  chatList: Conversation[]
}

type ChatAction = { type: "SET_CHAT_LIST"; payload: Conversation[] } | { type: "RESET" }

const initialState: ChatState = {
  chatList: []
}

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_CHAT_LIST":
      return { ...state, chatList: action.payload }
    case "RESET":
      return initialState
    default:
      return state
  }
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { data, isLoading, isError } = useChatListQuery()

  useEffect(() => {
    if (data?.conversations) {
      dispatch({ type: "SET_CHAT_LIST", payload: data.conversations })
      return
    }

    if (isError) {
      dispatch({ type: "RESET" })
    }
  }, [data, isError])

  return (
    <ChatContext.Provider
      value={{
        chatList: state.chatList,
        setChatList: (chatList) => dispatch({ type: "SET_CHAT_LIST", payload: chatList }),
        isLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
