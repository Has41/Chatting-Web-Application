import { createContext, ReactNode, useCallback, useEffect, useMemo, useReducer, type Dispatch, type SetStateAction } from "react"
import type { Conversation } from "@shared/types"
import { useChatListQuery } from "@chat/conversations/queries/chatQueries"
import useAuth from "@auth/hooks/useAuth"

interface ChatContextType {
  chatList: Conversation[]
  setChatList: Dispatch<SetStateAction<Conversation[]>>
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
  const { isAuthenticated, user } = useAuth()
  const canLoadChats = Boolean(isAuthenticated && user?._id)
  const { data, isLoading, isError } = useChatListQuery(canLoadChats)

  useEffect(() => {
    if (!canLoadChats) {
      dispatch({ type: "RESET" })
      return
    }

    if (data?.conversations) {
      dispatch({ type: "SET_CHAT_LIST", payload: data.conversations })
      return
    }

    if (isError) {
      dispatch({ type: "RESET" })
    }
  }, [canLoadChats, data, isError])

  const setChatList = useCallback(
    (chatList: SetStateAction<Conversation[]>) => {
      dispatch({ type: "SET_CHAT_LIST", payload: typeof chatList === "function" ? chatList(state.chatList) : chatList })
    },
    [state.chatList]
  )

  const value = useMemo(
    () => ({
      chatList: state.chatList,
      setChatList,
      isLoading
    }),
    [isLoading, setChatList, state.chatList]
  )

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
