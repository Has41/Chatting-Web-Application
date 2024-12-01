import React, { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import useFetch from "../hooks/useFetch"

const PrivateTest = () => {
  const [userId, setUserId] = useState("")
  const [conversationId, setConversationId] = useState("")
  const [messageSent, setMessagesSent] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [lastMessage, setLastMessage] = useState([])
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)
  // const [recipientId, setRecipientId] = useState(null)
  const [file, setFile] = useState(null)

  const recipientId = userId === "66c30544b750978ff0c18b60" ? "66c45ad7cdba8bc22d0d200a" : "66c30544b750978ff0c18b60"

  // Refs for IntersectionObserver
  const messageRefs = useRef({})

  const { data: conversationData } = useFetch({
    endpoint: `/api/conversations/get-current-convo/66cc3ebfc635677da688854a`,
    method: "GET",
    queryOptions: {
      onError: (error) => {
        console.error("Custom error handling:", error.message)
      },
      staleTime: 1000 * 60 * 5
    }
  })

  // prettier-ignore
  const { mutate, isError: uploadError, isSuccess: uploadSuccess } = useFetch({
    endpoint: "/api/files/upload-files",
    method: "POST",
    body: null, // Initial empty body, updated in handleFileUpload
    options: {
      mutationOptions: {
        onSuccess: (data) => {
          console.log("File uploaded successfully", data)
          setFile(null)
        },
        onError: (error) => {
          console.error("File upload error:", error)
        },
      },
    },
  })

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_BASE_URL, { query: { userId } })
    setSocket(newSocket)

    const handleReceiveMessage = (messageData, fileData) => {
      setMessages((prevMessages) => [...prevMessages, messageData, fileData])
    }

    newSocket.on("receiveMessage", handleReceiveMessage)

    return () => {
      newSocket.off("receiveMessage", handleReceiveMessage)
      newSocket.disconnect()
    }
  }, [userId])

  useEffect(() => {
    if (uploadError) {
      console.error("File upload error:", uploadError)
    }
  }, [uploadError])

  useEffect(() => {
    if (uploadSuccess) {
      console.log("File upload was successful")
    }
  }, [uploadSuccess])

  useEffect(() => {
    if (conversationData) {
      console.log(conversationData)
      setLastMessage(conversationData.conversation.lastMessage)
      setConversationId(conversationData.conversation._id)
      setMessages(conversationData.messages || [])
    }
  }, [conversationData])

  const checkCondition = () => {
    const lastMessage = conversationData?.conversation?.lastMessage
    const lastMessageData = conversationData?.messages.find((msg) => msg._id === lastMessage)

    if (lastMessageData && lastMessageData.seenBy.length === 0) {
      console.log("Last message found and not seen by anyone yet:", lastMessageData)
      return true
    }

    if (messageSent) {
      return true
    }

    return false
  }

  useEffect(() => {
    if (conversationId || socket || userId) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const conversationType = conversationData?.conversation?.conversationType
              const messageId = entry.target.dataset.messageId
              const lastMessageData = conversationData?.messages.find((msg) => msg._id === messageId)

              if (
                messageId &&
                lastMessageData &&
                lastMessageData.recipient._id === userId &&
                lastMessageData.seenBy.length === 0
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
  }, [checkCondition])

  const sendMessage = () => {
    try {
      if (messageContent || file) {
        if (file) {
          const formData = new FormData()
          formData.append("file", file)

          mutate(formData, {
            onSuccess: (data) => {
              const messageContentData = {
                content: messageContent || "",
                sender: userId,
                recipient: recipientId,
                messageType: "file",
                conversationType: "private",
                conversationId: null
              }

              socket.emit("sendMessage", messageContentData, data)
              setMessagesSent(true)
              setMessageContent("")
              setFile(null)
            },
            onError: (error) => {
              console.error("File upload error:", error)
              setMessagesSent(false)
            }
          })
        } else {
          const messageContentData = {
            content: messageContent,
            sender: userId,
            recipient: recipientId,
            messageType: "text",
            conversationType: "private",
            conversationId: null
          }
          socket.emit("sendMessage", messageContentData, null)
          setMessagesSent(true)
          setMessageContent("")
        }
      } else {
        console.error("Failed to send message: No content or file provided")
        setMessagesSent(false)
      }
    } catch (err) {
      console.error(err)
      setMessagesSent(false)
    }
  }

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    setFile(uploadedFile)
    console.log(file)
  }

  return (
    <div>
      <h1>Test Messaging</h1>
      {!userId || !conversationId ? (
        <div className="flex flex-col gap-y-6 mt-4">
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
            placeholder={`Type message for ${userId === "66c30544b750978ff0c18b60" ? "User B" : "User A"}`}
          />
          <button onClick={sendMessage}>Send</button>
          <input type="file" onChange={handleFileUpload} />
          <div>
            <h2>Messages</h2>
            <ul>
              {messages.map((message) => (
                <li key={message?._id} data-message-id={message?._id} ref={(el) => (messageRefs.current[message?._id] = el)}>
                  <strong>{message?.sender?.username}:</strong>
                  {message?.messageType === "file" ? (
                    <div>
                      <img
                        src={message?.media?.mediaUrl}
                        alt="Uploaded file"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  ) : (
                    <span>{message?.content}</span>
                  )}
                  <br />
                  <small>
                    {message?._id === lastMessage && message?.seenBy?.length > 0 && message?.sender?._id === userId
                      ? message.seenBy.map((seen) => (
                          <span key={seen.user?._id}>
                            Seen by {seen?.user?.username} at {new Date(seen.seenAt).toLocaleString()}
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

export default PrivateTest
