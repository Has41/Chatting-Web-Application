import React, { useState, useEffect, useRef } from "react"
import { chatOptions } from "../../utils/dynamicData"
import useAuth from "../../hooks/useAuth"
import { useQuery } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { USER_PATHS, CONVERSATION_PATHS } from "../../constants/apiPaths"
import { useNavigate, useParams } from "react-router-dom"
import { io } from "socket.io-client"
import ChatMessages from "./Messages/ChatMessages"
import SendMessage from "./Messages/SendMessage"

const Chatbox = () => {
  const { user } = useAuth()
  const { conversationId, userId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [lastMessage, setLastMessage] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    if (user._id) {
      socketRef.current = io(import.meta.env.VITE_API_BASE_URL, { query: { userId: user._id } })

      socketRef.current.on("connect", () => {
        console.log("Connected to socket:", socketRef.current.id)
      })

      socketRef.current.on("receiveMessage", (messageData) => {
        console.log("Received message:", messageData)
        if (!conversationId && messageData.conversation) {
          navigate(`/chat/conversation/${messageData.conversation}`)
        }
        setMessages((prev) => [...prev, messageData])
      })

      return () => {
        socketRef.current.disconnect()
      }
    }
  }, [user._id, conversationId, navigate])

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
      console.error(error)
    },
    enabled: !!userId || !!conversationId
  })

  const handleSendMessage = () => {
    if (!messageContent.trim()) return

    const recipientId = userId ? userId : userData?._id

    const messageData = {
      conversationId,
      sender: user._id,
      content: messageContent,
      recipient: recipientId,
      messageType: "text",
      conversationType: "private"
    }

    if (socketRef.current) {
      socketRef.current.emit("sendMessage", messageData, null)
    }
    setMessageContent("")
  }

  return (
    <section className="flex h-screen w-[69%] flex-col font-poppins">
      <nav className="flex items-center justify-between border-b px-4 py-3 text-black/80">
        <div className="flex items-center gap-x-3">
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

      <ChatMessages
        lastMessage={lastMessage}
        conversationId={conversationId}
        user={user}
        userData={userData}
        socketMessages={messages}
        socket={socketRef}
      />

      <SendMessage
        handleSendMessage={handleSendMessage}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
      />
    </section>
  )
}

export default Chatbox
