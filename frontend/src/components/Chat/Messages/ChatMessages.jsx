import React from "react"
import { useInfiniteQuery } from "react-query"
import axiosInstance from "../../../utils/axiosInstance"
import { CONVERSATION_PATHS } from "../../../constants/apiPaths"
import Message from "./Message"

const ChatMessages = ({ conversationId, user, userData, socketMessages, lastMessage, socket }) => {
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
      getNextPageParam: (lastPage, pages) => (lastPage.messages.length === 20 ? pages.length + 1 : undefined),
      enabled: !!conversationId
    }
  )

  const fetchedMessages = infiniteData?.pages.flatMap((page) => page.messages) || []

  const combinedMessages = [...fetchedMessages, ...socketMessages]

  const deduplicatedMessages = Array.from(new Map(combinedMessages.map((msg) => [msg._id, msg])).values())

  deduplicatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const handleScroll = (e) => {
    const { scrollTop } = e.target
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div onScroll={handleScroll} className="flex-grow overflow-y-auto bg-gray-100 p-4">
      {isFetchingNextPage && <div>Loading more messages...</div>}
      {deduplicatedMessages.map((msg) => {
        const isSender = msg.sender === user._id || (msg.sender && msg.sender._id === user._id)
        return (
          <div key={msg._id} className={`flex ${isSender ? "mb-1 justify-end" : "mb-4 justify-start"}`}>
            {!isSender && (
              <img
                src={userData?.profilePicture?.url || "https://via.placeholder.com/40"}
                alt="Profile"
                className="mr-2 mt-auto h-8 w-8 rounded-full object-cover"
              />
            )}
            <Message
              isSender={isSender}
              message={msg}
              lastMessage={lastMessage}
              conversationId={conversationId}
              socket={socket}
              conversationType={"private"}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ChatMessages
