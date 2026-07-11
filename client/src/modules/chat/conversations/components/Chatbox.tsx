import { useEffect, useReducer } from "react"
import useAuth from "@auth/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { USER_PATHS, CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import { useParams } from "react-router-dom"
import { MoreVertical, Phone, Video } from "lucide-react"
import AudioCallPanel from "@calls/components/AudioCallPanel"
import useCallSocket from "@calls/socket/useCallSocket"
import ChatMessages from "./Messages/ChatMessages"
import SendMessage from "./Messages/SendMessage"
import ProfileSidebar from "./ProfileSidebar"
import useChatSocket from "@chat/socket/useChatSocket"
import { chatBoxReducer, initialChatBoxState } from "@chat/conversations/state/chatBoxState"
import type { User } from "@shared/types"

const Chatbox = () => {
  const { user } = useAuth()
  const { conversationId, userId } = useParams()
  const [state, dispatch] = useReducer(chatBoxReducer, initialChatBoxState)

  const setMessages = (payload: any[] | ((prev: any[]) => any[])) => dispatch({ type: "SET_MESSAGES", payload })

  const { socketRef, sendMessage, typingUsers, emitTypingStart, emitTypingStop } = useChatSocket({
    userId: user?._id,
    conversationId,
    setMessages
  })
  const audioCall = useCallSocket(user?._id)

  const { data: chatData, error: chatError } = useQuery({
    queryKey: ["chatData", userId, conversationId],
    queryFn: async () => {
      if (userId) {
        const response = await axiosInstance.get(`${USER_PATHS.GET_INFO}/${userId}`)
        return response.data
      } else if (conversationId) {
        const response = await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_CONVO}/${conversationId}`)
        return response.data
      }
      return null
    },
    enabled: Boolean(user && (userId || conversationId))
  })

  useEffect(() => {
    if (!chatData || !user) return

    if (conversationId) {
      dispatch({ type: "SET_LAST_MESSAGE", payload: chatData.conversation.lastMessage })
      const filteredParticipants = chatData.conversation.participants.filter(
        (participant: User) => participant._id !== user._id
      )
      dispatch({ type: "SET_USER_DATA", payload: filteredParticipants[0] || null })
      return
    }

    dispatch({ type: "SET_USER_DATA", payload: chatData })
  }, [chatData, conversationId, user])

  useEffect(() => {
    if (!chatError || import.meta.env.PROD) return
    console.error(chatError)
  }, [chatError])

  if (!user) return null

  return (
    <section className="font-poppins relative flex h-screen w-[69%] flex-col">
      <nav className="flex items-center justify-between border-b px-4 py-3 text-black/80">
        <div onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })} className="flex cursor-pointer items-center gap-x-3">
          <img
            src={state.userData?.profilePicture?.url || "https://via.placeholder.com/40"}
            alt="Profile"
            className="size-10 rounded-full object-cover"
          />
          <div className="flex items-center gap-x-2">
            <h1 className="mb-[0.1rem] font-semibold">{state.userData?.username || "Username"}</h1>
            <div className="bg-custom-green size-[0.6rem] rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const recipientId = userId || state.userData?._id
              if (recipientId) audioCall.startAudioCall(recipientId)
            }}
            disabled={audioCall.status !== "idle" || !(userId || state.userData?._id)}
            className="inline-flex size-9 items-center justify-center rounded-full transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Start audio call"
            title="Audio call"
          >
            <Phone className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const recipientId = userId || state.userData?._id
              if (recipientId) audioCall.startVideoCall(recipientId)
            }}
            disabled={audioCall.status !== "idle" || !(userId || state.userData?._id)}
            className="inline-flex size-9 items-center justify-center rounded-full transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Start video call"
            title="Video call"
          >
            <Video className="size-5" />
          </button>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full transition hover:bg-gray-100"
            aria-label="More chat options"
            title="More"
          >
            <MoreVertical className="size-5" />
          </button>
        </div>
      </nav>

      <AudioCallPanel
        status={audioCall.status}
        callType={audioCall.callType}
        remoteStream={audioCall.remoteStream}
        localStream={audioCall.localStream}
        peer={state.userData}
        error={audioCall.error}
        isMuted={audioCall.isMuted}
        isCameraOff={audioCall.isCameraOff}
        onAccept={audioCall.acceptCall}
        onReject={audioCall.rejectCall}
        onEnd={audioCall.endCall}
        onToggleMute={audioCall.toggleMute}
        onToggleCamera={audioCall.toggleCamera}
      />

      <ProfileSidebar
        isOpen={state.isSidebarOpen}
        onClose={() => dispatch({ type: "SET_SIDEBAR", payload: false })}
        data={state.userData}
        conversationId={conversationId}
      />

      <ChatMessages
        lastMessage={state.lastMessage}
        conversationId={conversationId}
        setMessages={setMessages}
        user={user}
        conversationType={"private"}
        userData={state.userData}
        socketMessages={state.messages}
        socket={socketRef}
        typingUsers={typingUsers}
      />

      <SendMessage
        sendMessage={sendMessage}
        setMessages={setMessages}
        conversationId={conversationId}
        socketRef={socketRef}
        recipientId={userId || state.userData?._id}
        messageContent={state.messageContent}
        setMessageContent={(value) => dispatch({ type: "SET_MESSAGE_CONTENT", payload: value })}
        onTypingStart={() =>
          emitTypingStart({
            conversationId,
            conversationType: "private",
            recipientId: userId || state.userData?._id,
            username: user.username
          })
        }
        onTypingStop={() =>
          emitTypingStop({
            conversationId,
            conversationType: "private",
            recipientId: userId || state.userData?._id,
            username: user.username
          })
        }
      />
      <div id="inline-preview-root" className="absolute bottom-20 left-0 z-50 w-full" />
    </section>
  )
}

export default Chatbox
