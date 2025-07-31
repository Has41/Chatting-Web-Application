import { useState } from "react"
import { chatOptions } from "../../utils/dynamicData"
import { useParams } from "react-router-dom"
import { useQuery } from "react-query"
import useAuth from "../../hooks/useAuth"
import axiosInstance from "../../utils/axiosInstance"
import { CONVERSATION_PATHS } from "../../constants/apiPaths"
import ChatMessages from "./Messages/ChatMessages"
import SendMessage from "./Messages/SendMessage"
import ProfileSidebar from "./ProfileSidebar"
import useChatSocket from "../../hooks/useChatSocket"

const GroupChatbox = () => {
  const { user } = useAuth()
  const { conversationId } = useParams()

  const [messages, setMessages] = useState([])
  const [lastMessage, setLastMessage] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [groupData, setGroupData] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { socketRef, sendMessage } = useChatSocket({
    userId: user._id,
    conversationId,
    setMessages,
    type: "group"
  })

  useQuery({
    queryKey: ["groupConversation", conversationId],
    queryFn: async () => await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_CONVO}/${conversationId}`),
    onSuccess: ({ data }) => {
      setGroupData(data.conversation)
      setLastMessage(data.conversation.lastMessage)
    },
    onError: (err) => console.error("Failed to load group:", err),
    enabled: !!conversationId
  })

  // const handleSendMessage = () => {
  //   if (!messageContent.trim()) return

  //   const messageData = {
  //     conversationId,
  //     sender: user._id,
  //     content: messageContent,
  //     messageType: "text",
  //     conversationType: "group"
  //   }

  //   if (socketRef.current) {
  //     socketRef.current.emit("sendMessage", messageData, null)
  //   }
  //   setMessageContent("")
  // }

  return (
    <section className="flex h-screen w-[69%] flex-col font-poppins">
      <nav className="flex items-center justify-between border-b px-4 py-3 text-black/80">
        <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex cursor-pointer items-center gap-x-3">
          {groupData?.groupPicture?.url ? (
            <img
              src={groupData?.groupPicture?.url}
              alt={groupData?.groupName}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-white">
              {groupData?.groupName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex items-center gap-x-2">
            <h1 className="mb-[0.1rem] font-semibold">{groupData?.groupName || "Group Chat"}</h1>
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
        isOpen={isSidebarOpen}
        setData={setGroupData}
        onClose={() => setIsSidebarOpen(false)}
        data={groupData}
      />

      <ChatMessages
        lastMessage={lastMessage}
        setMessages={setMessages}
        conversationId={conversationId}
        conversationType={"group"}
        userData={groupData}
        socketMessages={messages}
        socket={socketRef}
      />

      <SendMessage
        sendMessage={sendMessage}
        conversationId={conversationId}
        socketRef={socketRef}
        conversationType={"group"}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
      />
    </section>
  )
}

export default GroupChatbox
