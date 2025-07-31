import { useInfiniteQuery } from "react-query"
import axiosInstance from "../../../utils/axiosInstance"
import { CONVERSATION_PATHS } from "../../../constants/apiPaths"
import Message from "./Message"
import useAuth from "../../../hooks/useAuth"
import getGroupRecipients from "../../../utils/getGroupRecipients"
import { useEffect, useRef } from "react"

const ChatMessages = ({ conversationId, userData, setMessages, socketMessages, lastMessage, socket, conversationType }) => {
  const { user } = useAuth()
  const scrollRef = useRef(null)

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    ["getUserMessages", conversationId],
    async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_MESSAGES}/${conversationId}`, {
        params: { page: pageParam, limit: 20 }
      })
      return response.data
    },
    {
      onSuccess: (data) => {
        console.log(data)
      }
    },
    {
      onError: (error) => {
        if (!import.meta.env.PROD) console.error("Error fetching messages:", error)
      },
      getNextPageParam: (lastPage, pages) => (lastPage.messages.length === 20 ? pages.length + 1 : undefined),
      enabled: !!conversationId
    }
  )

  const fetchedMessages = infiniteData?.pages.flatMap((page) => page.messages) || []
  const combinedMessages = [...fetchedMessages, ...socketMessages]

  // De-duplicate by message ID
  const messageMap = new Map(combinedMessages.map((msg) => [msg._id, msg]))
  const deduplicatedMessages = Array.from(messageMap.values())

  deduplicatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const handleScroll = (e) => {
    const { scrollTop } = e.target
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [deduplicatedMessages])

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="flex-grow overflow-y-auto bg-gray-100 p-4">
      {isFetchingNextPage && <div className="text-center text-sm text-gray-500">Loading more messages...</div>}

      {deduplicatedMessages.map((msg) => {
        const isSender = msg.sender === user._id
        const recipients = conversationType === "group" ? getGroupRecipients(userData, user._id) : userData

        return (
          <div key={msg._id} className={`flex items-end ${isSender ? "mb-1 justify-end" : "mb-4 justify-start"}`}>
            {!isSender && conversationType === "group" && (
              <div className="mr-2 mt-4 flex flex-col items-center">
                {(() => {
                  const sender = recipients.find(
                    (recipient) => recipient._id === msg.sender || recipient._id === msg.sender?._id
                  )
                  return sender ? (
                    <img
                      src={sender.profilePicture?.url || "https://via.placeholder.com/40"}
                      alt={sender.username}
                      className="mb-1 h-8 w-8 rounded-full object-cover"
                    />
                  ) : null
                })()}
              </div>
            )}

            {!isSender && conversationType !== "group" && (
              <div className="mr-2 mt-4 flex flex-col items-center">
                <img
                  src={userData?.profilePicture?.url || "https://via.placeholder.com/40"}
                  alt={userData?.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
            )}

            <Message
              isSender={isSender}
              message={msg}
              recipientData={conversationType === "group" && getGroupRecipients(userData, user._id)}
              lastMessage={lastMessage}
              setMessages={setMessages}
              conversationId={conversationId}
              socket={socket}
              conversationType={conversationType}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ChatMessages
