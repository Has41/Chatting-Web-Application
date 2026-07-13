import { useContext } from "react"
import { ChatContext } from "@chat/conversations/services/chatContextValue"

export const useChatList = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatList must be used within ChatProvider")
  }
  return context
}

export default useChatList
