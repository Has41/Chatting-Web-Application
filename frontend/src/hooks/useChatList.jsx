import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"

const useChatList = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatList must be used within an AuthProvider")
  }
  return context
}

export default useChatList
