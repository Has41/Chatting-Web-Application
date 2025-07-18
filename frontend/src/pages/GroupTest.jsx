import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import useFetch from "../hooks/useFetch"

const GroupTest = () => {
  const [userId, setUserId] = useState("")
  const [messages, setMessages] = useState([])
  const [messageContent, setMessageContent] = useState("")
  const [messageSent, setMessagesSent] = useState(false)
  const [conversationId, setConversationId] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const [socket, setSocket] = useState(null)

  const messageRefs = useRef({})

  // prettier-ignore
  const { data: conversationData, isLoading, isError, error, refetch } = useFetch({
    endpoint: `/api/conversations/get-current-convo/66cd98368a1e042a71bd1357`,
    method: "GET",
    queryOptions: {
      onError: (error) => {
        console.error("Custom error handling:", error.message);
      },
      staleTime: 1000 * 60 * 5,
    },
  });

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_BASE_URL, { query: { userId } })
    setSocket(newSocket)

    newSocket.emit("join-group", conversationId, userId)

    // Receive messages from the group
    const handleReceiveMessages = (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData])
    }

    newSocket.on("recieve-group-messages", handleReceiveMessages)

    return () => {
      newSocket.off("recieve-group-messages", handleReceiveMessages)
      newSocket.disconnect()
    }
  }, [userId, conversationId])

  useEffect(() => {
    if (conversationData) {
      setLastMessage(conversationData.conversation.lastMessage)
      setMessages(conversationData.messages || [])
      console.log(conversationData)
    }
  }, [conversationData])

  // const checkCondition = () => {
  //   const lastMessageId = conversationData.conversation.lastMessage
  //   const lastMessageData = conversationData.messages.find((msg) => msg._id === lastMessageId)

  //   if (!lastMessageData) {
  //     console.log("Last message not found in the conversation data.")
  //     return false
  //   }

  //   // Ensure the last message is relevant (e.g., it's not from the current user or it's not an old message)
  //   if (
  //     lastMessageData.seenBy.length === 0 &&
  //     lastMessageData.sender._id !== userId &&
  //     new Date(lastMessageData.createdAt) < new Date()
  //   ) {
  //     console.log("Last message found and not seen by anyone yet:", lastMessageData)
  //     return true
  //   }

  //   if (messageSent && lastMessageData.seenBy.length > 0) {
  //     console.log("Message was sent but has seen entries:", lastMessageData)
  //     return false
  //   }

  //   return false
  // }

  useEffect(() => {
    if (conversationId || socket || userId) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log(conversationData.messages)
              const conversationType = conversationData.conversation.conversationType
              const messageId = entry.target.dataset.messageId
              const lastMessage = conversationData.conversation.lastMessage
              const seenByUser = conversationData.messages?.seenBy?.find(
                (seen) => seen.user.toString() === userId.toString()
              )
              const lastMessageData = conversationData.messages.find((msg) => msg._id === lastMessage)
              const isParticipant = conversationData.conversation.participants.some(
                (participant) => participant._id === userId
              )
              const isParticipantOwner = conversationData.conversation.groupOwner === userId

              if (
                messageId &&
                !seenByUser &&
                (isParticipant || isParticipantOwner) &&
                lastMessageData.sender._id !== userId &&
                document.visibilityState === "visible"
              ) {
                socket.emit("markMessageAsSeen", conversationId, userId, conversationType)
              }
            }
          })
        },
        { threshold: 1.0 }
      )

      const lastMessageRef = messageRefs.current[lastMessage]
      if (lastMessageRef) {
        observer.observe(lastMessageRef)
      }

      return () => {
        if (lastMessageRef) {
          observer.unobserve(lastMessageRef)
        }
      }
    }
  }, [conversationId, socket, userId, conversationData, messageSent])

  const sendGroupMessage = async () => {
    try {
      if (messageContent && socket) {
        const messageContentData = {
          sender: userId,
          recipient: null,
          content: messageContent,
          messageType: "text",
          conversationId,
          conversationType: "group" // Use conversationId state variable
        }
        socket.emit("sendMessage", messageContentData)
        setMessagesSent(true)
        setMessageContent("")
      } else {
        console.error("Failed to send message")
        setMessagesSent(false)
      }
    } catch (err) {
      console.error(err)
      setMessagesSent(false)
    }
  }

  return (
    <div>
      <h1>Test Messaging</h1>
      {!userId || !conversationId ? (
        <div className="mt-4 flex flex-col gap-y-6">
          <input type="text" placeholder="Enter your user ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <input
            type="text"
            placeholder="Enter the conversation ID"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
          />
          <button onClick={() => setUserId(userId)}>Connect</button>
        </div>
      ) : (
        <div>
          <h2>User {userId}</h2>
          <h3>Conversation {conversationId}</h3>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Send messages to group"
          />
          <button onClick={sendGroupMessage}>Send</button>
          <div>
            <h2>Messages</h2>
            <ul>
              {messages?.map((message) => (
                <li key={message._id} data-message-id={message._id} ref={(el) => (messageRefs.current[message._id] = el)}>
                  <strong>{message.sender.username}:</strong> {message.content}
                  <br />
                  <small>
                    {message._id === lastMessage && message.seenBy.length > 0 && message.sender._id === userId
                      ? message.seenBy.map((seen) => (
                          <span key={seen.user._id}>
                            Seen by {seen.user.username} at {new Date(seen.seenAt).toLocaleString()}
                          </span>
                        ))
                      : ""}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupTest
