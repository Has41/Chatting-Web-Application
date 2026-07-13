import { createContext, type Dispatch, type SetStateAction } from "react"
import type { Conversation } from "@shared/types"

export interface ChatContextType {
  chatList: Conversation[]
  setChatList: Dispatch<SetStateAction<Conversation[]>>
  isLoading: boolean
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)
