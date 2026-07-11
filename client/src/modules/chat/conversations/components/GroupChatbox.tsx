import { useEffect, useState, type SetStateAction } from "react"
import { chatOptions } from "@shared/utils/dynamicData"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import useAuth from "@auth/hooks/useAuth"
import axiosInstance from "@shared/api/api-client"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import ChatMessages from "./Messages/ChatMessages"
import SendMessage from "./Messages/SendMessage"
import ProfileSidebar from "./ProfileSidebar"
import useChatSocket from "@chat/socket/useChatSocket"
import type { Conversation } from "@shared/types"

const GroupChatbox = () => {
  const { user } = useAuth()
  const { conversationId } = useParams()

  const [messages, setMessages] = useState<any[]>([])
  const [messageContent, setMessageContent] = useState("")
  const [groupOverride, setGroupOverride] = useState<Conversation | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { socketRef, sendMessage, typingUsers, emitTypingStart, emitTypingStop } = useChatSocket({
    userId: user?._id,
    conversationId,
    setMessages,
    type: "group"
  })

  const { data: groupResponse, error: groupError } = useQuery({
    queryKey: ["groupConversation", conversationId],
    queryFn: async () => {
      const response = await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_CONVO}/${conversationId}`)
      return response.data
    },
    enabled: Boolean(user && conversationId)
  })

  useEffect(() => {
    if (!groupError) return
    console.error("Failed to load group:", groupError)
  }, [groupError])

  if (!user) return null

  const serverGroupData = groupResponse?.conversation ?? null
  const groupData =
    groupOverride && serverGroupData && groupOverride._id === serverGroupData._id
      ? { ...serverGroupData, ...groupOverride }
      : serverGroupData
  const lastMessage = groupData?.lastMessage ?? ""

  const setGroupData = (value: SetStateAction<Conversation | null>) => {
    setGroupOverride((previous) => (typeof value === "function" ? value(previous ?? serverGroupData) : value))
  }

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
    <section className="font-poppins relative flex h-screen w-[69%] flex-col">
      <nav className="flex items-center justify-between border-b px-4 py-3 text-black/80">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex cursor-pointer items-center gap-x-3 bg-transparent p-0 text-left"
          aria-label="Open group info"
        >
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
        </button>

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
        conversationId={conversationId}
      />

      <ChatMessages
        lastMessage={lastMessage}
        setMessages={setMessages}
        conversationId={conversationId}
        conversationType={"group"}
        userData={groupData}
        socketMessages={messages}
        socket={socketRef}
        typingUsers={typingUsers}
      />

      <SendMessage
        sendMessage={sendMessage}
        setMessages={setMessages}
        conversationId={conversationId}
        socketRef={socketRef}
        conversationType={"group"}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
        onTypingStart={() =>
          emitTypingStart({
            conversationId,
            conversationType: "group",
            username: user.username
          })
        }
        onTypingStop={() =>
          emitTypingStop({
            conversationId,
            conversationType: "group",
            username: user.username
          })
        }
      />
    </section>
  )
}

export default GroupChatbox
