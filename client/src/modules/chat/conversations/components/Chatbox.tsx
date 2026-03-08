import { useReducer } from "react"
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

const Chatbox = () => {
  const { user } = useAuth()
  const { conversationId, userId } = useParams()
  const [state, dispatch] = useReducer(chatBoxReducer, initialChatBoxState)

  const setMessages = (payload) => dispatch({ type: "SET_MESSAGES", payload })

  const { socketRef, sendMessage } = useChatSocket({
    userId: user._id,
    conversationId,
    setMessages
  })

  useQuery({
    queryKey: ["chatData", userId, conversationId],
    queryFn: async () => {
      if (userId) {
        return await axiosInstance.get(`${USER_PATHS.GET_INFO}/${userId}`)
      } else if (conversationId) {
        return await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_CONVO}/${conversationId}`)
      }
      return null
    },
    onSuccess: ({ data }) => {
      if (conversationId) {
        dispatch({ type: "SET_LAST_MESSAGE", payload: data.conversation.lastMessage })
        const filteredParticipants = data.conversation.participants.filter((participant) => participant._id !== user._id)
        dispatch({ type: "SET_USER_DATA", payload: filteredParticipants[0] || null })
      } else {
        dispatch({ type: "SET_USER_DATA", payload: data })
      }
    },
    onError: (error) => {
      if (import.meta.env.PROD) return
      console.error(error)
    },
    enabled: !!userId || !!conversationId
  })

  return (
    <section className="font-poppins flex h-screen w-[69%] flex-col">
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
      />

      <SendMessage
        sendMessage={sendMessage}
        conversationId={conversationId}
        socketRef={socketRef}
        recipientId={userId || state.userData?._id}
        messageContent={state.messageContent}
        setMessageContent={(value) => dispatch({ type: "SET_MESSAGE_CONTENT", payload: value })}
      />
      <div id="inline-preview-root" className="absolute bottom-20 left-0 z-50 w-full" />
    </section>
  )
}

export default Chatbox
