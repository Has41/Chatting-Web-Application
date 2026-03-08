import { useContext } from "react"
import { ChatContext } from "@chat/conversations/services/chatContext"

export const useChatList = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatList must be used within ChatProvider")
  }
  return context
}

export default useChatList
