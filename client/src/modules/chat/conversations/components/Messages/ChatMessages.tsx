import { useInfiniteQuery } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import Message from "./Message"
import useAuth from "@auth/hooks/useAuth"
import getGroupRecipients from "@shared/utils/getGroupRecipients"
import { useEffect, useRef, type UIEvent } from "react"
import resolveFilePreviewType from "@shared/utils/resolveFilePreviewType"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import TypingIndicator from "./TypingIndicator"
import type { TypingUser } from "@chat/socket/useChatSocket"
import type { User } from "@shared/types"

const EMPTY_TYPING_USERS: TypingUser[] = []

interface ChatMessagesProps {
  conversationId?: string
  userData?: any
  setMessages: (value: any[] | ((prev: any[]) => any[])) => void
  socketMessages: any[]
  lastMessage?: any
  socket?: any
  conversationType?: "private" | "group"
  user?: any
  typingUsers?: TypingUser[]
}

const ChatMessages = ({
  conversationId,
  userData,
  setMessages,
  socketMessages,
  lastMessage,
  socket,
  conversationType,
  typingUsers = EMPTY_TYPING_USERS
}: ChatMessagesProps) => {
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const currentUserId = user?._id

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["getUserMessages", conversationId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_MESSAGES}/${conversationId}`, {
        params: { page: pageParam, limit: 20 }
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages: any[]) => (lastPage.messages.length === 20 ? pages.length + 1 : undefined),
    enabled: !!conversationId && !!currentUserId
  })

  const fetchedMessages = infiniteData?.pages.flatMap((page: any) => page.messages) || []
  const combinedMessages = [...fetchedMessages, ...socketMessages]

  // De-duplicate by message ID
  const messageMap = new Map(combinedMessages.map((msg) => [msg._id, msg]))
  const deduplicatedMessages = Array.from(messageMap.values())

  deduplicatedMessages.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))

  const typingUser = typingUsers[0]
  const groupRecipients = conversationType === "group" ? getGroupRecipients(userData, currentUserId ?? "") : []
  const typingProfile =
    conversationType === "group"
      ? groupRecipients.find((recipient: User) => recipient._id === typingUser?.userId)
      : userData

  const mediaGallery: MediaViewerItem[] = []
  const mediaGalleryIndexByMessageId = new Map<string, number>()

  deduplicatedMessages.forEach((msg) => {
    const media = msg.media
    const mediaUrl = media?.mediaUrl
    if (msg.messageType !== "file" || !mediaUrl) return

    const mediaType = resolveFilePreviewType({
      mediaType: media.mediaType,
      mimeType: media.mimeType,
      fileName: media.fileName,
      mediaUrl
    })

    if (mediaType !== "image" && mediaType !== "video") return

    mediaGalleryIndexByMessageId.set(msg._id, mediaGallery.length)
    mediaGallery.push({
      mediaUrl,
      mediaType,
      title: media.caption || media.fileName || mediaUrl.split("?")[0]?.split("/").pop() || "Media"
    })
  })

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [deduplicatedMessages, typingUsers.length])

  if (!user || !currentUserId) return null

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="grow overflow-y-auto bg-gray-100 p-4">
      {isFetchingNextPage && <div className="text-center text-sm text-gray-500">Loading more messages...</div>}

      {deduplicatedMessages.map((msg) => {
        const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id
        const isSender = senderId === currentUserId
        const recipients = conversationType === "group" ? groupRecipients : userData

        return (
          <div key={msg._id} className={`flex items-end ${isSender ? "mb-1 justify-end" : "mb-4 justify-start"}`}>
            {!isSender && conversationType === "group" && (
              <div className="mt-4 mr-2 flex flex-col items-center">
                {(() => {
                  const sender = recipients.find(
                    (recipient: any) => recipient._id === senderId
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
              <div className="mt-4 mr-2 flex flex-col items-center">
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
              recipientData={conversationType === "group" ? groupRecipients : []}
              lastMessage={lastMessage}
              setMessages={setMessages}
              conversationId={conversationId}
              socket={socket}
              conversationType={conversationType}
              mediaGallery={mediaGallery}
              mediaGalleryIndex={mediaGalleryIndexByMessageId.get(msg._id)}
            />
          </div>
        )
      })}

      <TypingIndicator
        typingUsers={typingUsers}
        avatarUrl={typingProfile?.profilePicture?.url}
        avatarLabel={typingProfile?.username || typingUser?.username}
      />
    </div>
  )
}

export default ChatMessages
