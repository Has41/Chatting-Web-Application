import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "@auth/hooks/useAuth"
import useChatList from "@chat/conversations/hooks/useChatList"
import useCallSocket from "@calls/socket/useCallSocket"
import { CHAT_PAGE } from "@shared/constants/routePaths"
import type { User } from "@shared/types"
import { getCallConversationRoute } from "@calls/utils/callLogsDisplay"

export const useCallLogActions = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { chatList, isLoading: isChatListLoading } = useChatList()
  const callSocket = useCallSocket(user?._id)
  const [openCallMenuId, setOpenCallMenuId] = useState<string | null>(null)
  const [activeCallPeer, setActiveCallPeer] = useState<User | null>(null)

  const openConversation = (peerId: string) => {
    if (isChatListLoading) return

    navigate(`${CHAT_PAGE}/${getCallConversationRoute(chatList, peerId)}`)
  }

  const toggleCallMenu = (logId: string) => {
    setOpenCallMenuId((currentId) => (currentId === logId ? null : logId))
  }

  const startCall = (peer: User | undefined, peerId: string, type: "audio" | "video") => {
    setActiveCallPeer(peer || null)
    setOpenCallMenuId(null)

    if (type === "audio") {
      callSocket.startAudioCall(peerId)
      return
    }

    callSocket.startVideoCall(peerId)
  }

  return {
    userId: user?._id,
    callSocket,
    activeCallPeer,
    openCallMenuId,
    isChatListLoading,
    openConversation,
    toggleCallMenu,
    startCall
  }
}
