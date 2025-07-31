import { useState } from "react"
import { chatOptions } from "../../utils/dynamicData"
import useAuth from "../../hooks/useAuth"
import { useQuery } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { USER_PATHS, CONVERSATION_PATHS } from "../../constants/apiPaths"
import { useParams } from "react-router-dom"
import ChatMessages from "./Messages/ChatMessages"
import SendMessage from "./Messages/SendMessage"
import ProfileSidebar from "./ProfileSidebar"
import useChatSocket from "../../hooks/useChatSocket"

const Chatbox = () => {
  const { user } = useAuth()
  const { conversationId, userId } = useParams()
  const [userData, setUserData] = useState(null)
  const [lastMessage, setLastMessage] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messages, setMessages] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
      } else {
        return null
      }
    },
    onSuccess: ({ data }) => {
      if (conversationId) {
        setLastMessage(data.conversation.lastMessage)
        const filteredParticipants = data.conversation.participants.filter((participant) => participant._id !== user._id)
        setUserData(filteredParticipants[0] || null)
      } else {
        setUserData(data)
      }
    },
    onError: (error) => {
      if (import.meta.env.PROD) return
      console.error(error)
    },
    enabled: !!userId || !!conversationId
  })

  return (
    <section className="flex h-screen w-[69%] flex-col font-poppins">
      <nav className="flex items-center justify-between border-b px-4 py-3 text-black/80">
        <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex cursor-pointer items-center gap-x-3">
          <img
            src={userData?.profilePicture?.url || "https://via.placeholder.com/40"}
            alt="Profile"
            className="size-10 rounded-full object-cover"
          />
          <div className="flex items-center gap-x-2">
            <h1 className="mb-[0.1rem] font-semibold">{userData?.username || "Username"}</h1>
            <div className="size-[0.6rem] rounded-full bg-custom-green"></div>
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

      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} data={userData} />

      <ChatMessages
        lastMessage={lastMessage}
        conversationId={conversationId}
        setMessages={setMessages}
        user={user}
        conversationType={"private"}
        userData={userData}
        socketMessages={messages}
        socket={socketRef}
      />

      <SendMessage
        sendMessage={sendMessage}
        conversationId={conversationId}
        socketRef={socketRef}
        recipientId={userId || userData?._id}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
      />
      <div id="inline-preview-root" className="absolute bottom-20 left-0 z-50 w-full" />
    </section>
  )
}

export default Chatbox
