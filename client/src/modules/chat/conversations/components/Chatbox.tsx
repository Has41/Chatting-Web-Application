import { useEffect, useReducer } from "react"
import { chatOptions } from "@shared/utils/dynamicData"
import useAuth from "@auth/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@shared/utils/axiosInstance"
import { USER_PATHS, CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import { useParams } from "react-router-dom"
import ChatMessages from "./Messages/ChatMessages"
import SendMessage from "./Messages/SendMessage"
import ProfileSidebar from "./ProfileSidebar"
import useChatSocket from "@chat/conversations/hooks/useChatSocket"
import { chatBoxReducer, initialChatBoxState } from "@chat/states/chatBoxState"
import type { User } from "@shared/types"

const Chatbox = () => {
  const { user } = useAuth()
  const { conversationId, userId } = useParams()
  const [state, dispatch] = useReducer(chatBoxReducer, initialChatBoxState)

  const setMessages = (payload: any[] | ((prev: any[]) => any[])) => dispatch({ type: "SET_MESSAGES", payload })

  if (!user) return null

  const { socketRef, sendMessage, typingUsers, emitTypingStart, emitTypingStop } = useChatSocket({
    userId: user._id,
    conversationId,
    setMessages
  })

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
    enabled: !!userId || !!conversationId
  })

  useEffect(() => {
    if (!chatData) return

    if (conversationId) {
      dispatch({ type: "SET_LAST_MESSAGE", payload: chatData.conversation.lastMessage })
      const filteredParticipants = chatData.conversation.participants.filter(
        (participant: User) => participant._id !== user._id
      )
      dispatch({ type: "SET_USER_DATA", payload: filteredParticipants[0] || null })
      return
    }

    dispatch({ type: "SET_USER_DATA", payload: chatData })
  }, [chatData, conversationId, user._id])

  useEffect(() => {
    if (!chatError || import.meta.env.PROD) return
    console.error(chatError)
  }, [chatError])

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
          {chatOptions.map((option, index) => (
            <div key={index} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={option.path} />
              </svg>
            </div>
          ))}
        </div>
      </nav>

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
