import { useEffect, useRef, useState } from "react"
import useIntersectionObserver from "@shared/hooks/useIntersectionObserver"
import useAuth from "@auth/hooks/useAuth"
import getSeenText from "@shared/utils/getSeenText"
import { formatTime } from "@shared/utils/dateTime"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { MESSAGE_PATHS } from "@shared/constants/apiPaths"
import EditMessageModal from "@chat/messages/components/EditMessageModal"
import FileMessagePreview from "@chat/attachments/components/FileMessagePreview"
import MessageReactions from "@chat/messages/components/MessageReactions"
import { AlertCircle, Send } from "lucide-react"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import type { Dispatch, RefObject, SetStateAction } from "react"
import type {
  ChatMessage,
  ChatSocketEmitter,
  ConversationMessagesCache,
  SeenUser
} from "@chat/conversations/types/chatMessages"

interface MessageProps {
  isSender: boolean
  message: ChatMessage
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  lastMessage?: ChatMessage
  recipientData?: Array<{ _id: string; username?: string }>
  conversationId?: string
  conversationType?: "private" | "group"
  socket: RefObject<ChatSocketEmitter | null>
  mediaGallery?: MediaViewerItem[]
  mediaGalleryIndex?: number
}

type EditMessageVariables = {
  messageId: string
  content: string
  field?: "content" | "caption"
}

type MessageMutationContext = {
  previousMessages?: unknown
}

const Message = ({
  isSender,
  message,
  setMessages,
  lastMessage,
  recipientData = [],
  conversationId,
  conversationType,
  socket,
  mediaGallery,
  mediaGalleryIndex
}: MessageProps) => {
  const messageRef = useRef<HTMLDivElement | null>(null)
  const hasMarkedSeenRef = useRef(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isVisible = useIntersectionObserver(messageRef as RefObject<Element>)
  const currentUserId = user?._id
  const messageId = message._id
  const [editContent, setEditContent] = useState<string>(message.content ?? "")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSeenUsernames, setShowSeenUsernames] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const senderId = typeof message.sender === "string" ? message.sender : message.sender?._id
  const isFileMessage = message.messageType === "file"
  const canEditMessage = !isFileMessage || !!message.media?.caption?.trim()
  const isSending = message.localStatus === "sending"
  const hasFailed = message.localStatus === "failed"
  const canReact = !isSending && !hasFailed
  const lastMessageId = lastMessage?._id
  const lastMessageSeenBy = lastMessage?.seenBy

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const updateCachedMessages = (updater: (messages: ChatMessage[]) => ChatMessage[]) => {
    queryClient.setQueryData<ConversationMessagesCache>(["getUserMessages", conversationId], (oldData) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          messages: updater(page.messages)
        }))
      }
    })
  }

  const updateMessageInState = (id: string, newContent: string, field: "content" | "caption") => {
    const updater = (messages: ChatMessage[]) =>
      messages.map((msg) =>
        msg._id === id
          ? {
              ...msg,
              content: field === "content" ? newContent : msg.content,
              media: field === "caption" ? { ...msg.media, caption: newContent } : msg.media,
              editedAt: new Date().toISOString()
            }
          : msg
      )

    setMessages((prev) => updater(prev))
    updateCachedMessages(updater)
  }

  const removeMessageFromState = (id: string) => {
    const updater = (messages: ChatMessage[]) => messages.filter((msg) => msg._id !== id)

    setMessages((prev) => updater(prev))
    updateCachedMessages(updater)
  }

  const applyReactionToMessage = (targetMessage: ChatMessage, emoji: string): ChatMessage => {
    if (!user || !currentUserId) return targetMessage

    const reactions = targetMessage.reactions ?? []
    const existingReaction = reactions.find((reaction) => {
      const reactionUserId = typeof reaction.user === "string" ? reaction.user : reaction.user?._id
      return reactionUserId === currentUserId || reaction.users?.includes(currentUserId)
    })
    const reactionsWithoutMine = reactions.reduce<typeof reactions>((nextReactions, reaction) => {
      const nextReaction = reaction.users?.includes(currentUserId)
        ? { ...reaction, users: reaction.users.filter((reactionUserId) => reactionUserId !== currentUserId) }
        : reaction
      const reactionUserId = typeof reaction.user === "string" ? reaction.user : reaction.user?._id
      const hasGroupedUsers = !nextReaction.users || nextReaction.users.length > 0

      if (reactionUserId !== currentUserId && hasGroupedUsers) {
        nextReactions.push(nextReaction)
      }

      return nextReactions
    }, [])

    const nextReactions =
      existingReaction?.emoji === emoji ? reactionsWithoutMine : [...reactionsWithoutMine, { user, emoji }]

    return { ...targetMessage, reactions: nextReactions }
  }

  const handleReact = (emoji: string) => {
    if (!canReact || !currentUserId) return

    const updater = (messages: ChatMessage[]) =>
      messages.map((msg) => (msg._id === message._id ? applyReactionToMessage(msg, emoji) : msg))

    setMessages((prev) => updater(prev))
    updateCachedMessages(updater)
    socket.current?.emit("react-to-message", { messageId: message._id, userId: currentUserId, emoji })
  }

  const { mutate: editMessage } = useMutation({
    mutationFn: async ({
      messageId,
      content,
      field
    }: {
      messageId: string
      content: string
      field?: "content" | "caption"
    }) => {
      return await axiosInstance.patch(`${MESSAGE_PATHS.EDIT_MESSAGE}/${messageId}`, {
        [field === "caption" ? "caption" : "content"]: content
      })
    },
    onMutate: async ({ messageId, content, field = "content" }: EditMessageVariables): Promise<MessageMutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["getUserMessages", conversationId] })
      const previousMessages = queryClient.getQueryData(["getUserMessages", conversationId])
      updateMessageInState(messageId, content, field)
      setShowDropdown(false)
      return { previousMessages }
    },
    onError: (error: unknown, _variables: EditMessageVariables, context: MessageMutationContext | undefined) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(["getUserMessages", conversationId], context.previousMessages)
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, content: message.content ?? "", media: message.media, editedAt: message.editedAt }
            : msg
        )
      )
      console.error("Error editing message:", error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserMessages", conversationId] })
    }
  })

  const { mutate: deleteMessage } = useMutation({
    mutationFn: async (messageId: string) => {
      return await axiosInstance.delete(`${MESSAGE_PATHS.DELETE_MESSAGE}/${messageId}`)
    },
    onMutate: async (messageId: string): Promise<MessageMutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["getUserMessages", conversationId] })
      const previousMessages = queryClient.getQueryData(["getUserMessages", conversationId])
      removeMessageFromState(messageId)
      setShowDropdown(false)
      return { previousMessages }
    },
    onError: (error: unknown, _messageId: string, context: MessageMutationContext | undefined) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(["getUserMessages", conversationId], context.previousMessages)
      }
      setMessages((prev) => (prev.some((msg) => msg._id === message._id) ? prev : [...prev, message]))
      console.error("Error deleting message:", error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserMessages", conversationId] })
    }
  })

  useEffect(() => {
    if (!currentUserId) return

    const hasCurrentUserSeen = lastMessageSeenBy?.some(
      (seen: SeenUser) => seen.user._id === currentUserId || seen.user?._id === currentUserId
    )
    if (
      messageId === lastMessageId &&
      isVisible &&
      !hasCurrentUserSeen &&
      !hasMarkedSeenRef.current &&
      senderId !== currentUserId
    ) {
      socket.current?.emit("markMessageAsSeen", conversationId, currentUserId, conversationType, lastMessageId)
      hasMarkedSeenRef.current = true
      console.log("Marked message as seen:", lastMessageId)
    }
  }, [
    conversationId,
    conversationType,
    currentUserId,
    isVisible,
    lastMessage?._id,
    lastMessageId,
    lastMessageSeenBy,
    message._id,
    messageId,
    senderId,
    socket,
    user?._id
  ])

  if (!user || !currentUserId) return null

  return (
    <div className={`mb-3 ${isSender ? "flex justify-end" : "flex justify-start"}`}>
      <div className="flex flex-col">
        <div className="group relative flex items-center gap-x-1">
          <MessageBubbleContent
            messageRef={messageRef}
            message={message}
            isSender={isSender}
            isSending={isSending}
            hasFailed={hasFailed}
            conversationType={conversationType}
            recipientData={recipientData}
            mediaGallery={mediaGallery}
            mediaGalleryIndex={mediaGalleryIndex}
          />
          <MessageActions
            message={message}
            actionState={{
              side: isSender ? "sender" : "recipient",
              delivery: isSending ? "sending" : hasFailed ? "failed" : "sent",
              dropdown: showDropdown ? "open" : "closed",
              editor: showEditModal ? "open" : "closed",
              editAvailability: canEditMessage ? "available" : "hidden",
              contentKind: isFileMessage ? "file" : "text"
            }}
            dropdownRef={dropdownRef}
            editContent={editContent}
            messageId={messageId}
            editMessage={editMessage}
            deleteMessage={deleteMessage}
            setEditContent={setEditContent}
            setShowDropdown={setShowDropdown}
            setShowEditModal={setShowEditModal}
          />
        </div>
        <MessageReactions
          reactions={message.reactions}
          currentUserId={currentUserId}
          disabled={!canReact}
          align={isSender ? "right" : "left"}
          onReact={handleReact}
        />
        <MessageSeenStatus
          message={message}
          lastMessage={lastMessage}
          currentUserId={currentUserId}
          conversationType={conversationType}
          showSeenUsernames={showSeenUsernames}
          setShowSeenUsernames={setShowSeenUsernames}
        />
      </div>
    </div>
  )
}

const MessageBubbleContent = ({
  messageRef,
  message,
  isSender,
  isSending,
  hasFailed,
  conversationType,
  recipientData,
  mediaGallery,
  mediaGalleryIndex
}: {
  messageRef: RefObject<HTMLDivElement | null>
  message: ChatMessage
  isSender: boolean
  isSending: boolean
  hasFailed: boolean
  conversationType?: "private" | "group"
  recipientData: Array<{ _id: string; username?: string }>
  mediaGallery?: MediaViewerItem[]
  mediaGalleryIndex?: number
}) => (
  <div
    ref={messageRef}
    className={`inline-block max-w-full overflow-x-hidden wrap-break-word whitespace-normal ${message?.messageType === "file" ? "p-1" : "px-4 py-3"} text-sm shadow transition-opacity ${
      isSending ? "opacity-80" : ""
    } ${
      message.messageType === "text"
        ? isSender
          ? "rounded-sent bg-custom-green text-white"
          : "rounded-recieved bg-custom-white text-black"
        : isSender
          ? "bg-custom-green rounded text-white"
          : "bg-custom-white rounded text-black"
    }`}
  >
    {!isSender && conversationType === "group" && <GroupSenderLabel message={message} recipientData={recipientData} />}
    {message.messageType === "file" ? (
      <FileBubbleContent
        message={message}
        isSender={isSender}
        isSending={isSending}
        hasFailed={hasFailed}
        mediaGallery={mediaGallery}
        mediaGalleryIndex={mediaGalleryIndex}
      />
    ) : (
      <TextBubbleContent message={message} isSending={isSending} hasFailed={hasFailed} />
    )}
  </div>
)

const GroupSenderLabel = ({
  message,
  recipientData
}: {
  message: ChatMessage
  recipientData: Array<{ _id: string; username?: string }>
}) => (
  <p className={`mb-2 ${message?.media?.mediaUrl && "p-2"} text-xs font-semibold text-green-600`}>
    {
      recipientData.find(
        (recipient) =>
          recipient._id === message.sender ||
          recipient._id === (typeof message.sender === "string" ? undefined : message.sender?._id)
      )?.username
    }
  </p>
)

const FileBubbleContent = ({
  message,
  isSender,
  isSending,
  hasFailed,
  mediaGallery,
  mediaGalleryIndex
}: {
  message: ChatMessage
  isSender: boolean
  isSending: boolean
  hasFailed: boolean
  mediaGallery?: MediaViewerItem[]
  mediaGalleryIndex?: number
}) => (
  <div className="flex flex-col">
    <FileMessagePreview
      fileMeta={message.media ?? { mediaUrl: "" }}
      isSender={isSender}
      mediaGallery={mediaGallery}
      mediaGalleryIndex={mediaGalleryIndex}
    />
    <div className={`mt-3 ml-auto px-2 pb-1 text-right text-xs select-none ${isSender ? "text-white" : "text-black/60"}`}>
      <MessageTimestamp message={message} isSending={isSending} hasFailed={hasFailed} />
    </div>
  </div>
)

const TextBubbleContent = ({
  message,
  isSending,
  hasFailed
}: {
  message: ChatMessage
  isSending: boolean
  hasFailed: boolean
}) => (
  <div className="flex max-w-96 flex-wrap items-end justify-between gap-x-4 gap-y-4">
    <div className="break-all">{message.content}</div>
    <div className="text-custom-white ml-auto block text-right text-xs select-none">
      <MessageTimestamp message={message} isSending={isSending} hasFailed={hasFailed} editedClassName="text-white" />
    </div>
  </div>
)

const MessageTimestamp = ({
  message,
  isSending,
  hasFailed,
  editedClassName
}: {
  message: ChatMessage
  isSending: boolean
  hasFailed: boolean
  editedClassName?: string
}) => (
  <>
    {message.editedAt && <span className={`mr-2 ${editedClassName ?? ""}`}>Edited</span>}
    {isSending ? (
      <span className="inline-flex items-center gap-1">
        <Send className="size-3 animate-pulse" strokeWidth={2} />
        Sending
      </span>
    ) : hasFailed ? (
      <span className="inline-flex items-center gap-1 text-red-100">
        <AlertCircle className="size-3" strokeWidth={2} />
        Failed
      </span>
    ) : (
      formatTime(message.createdAt)
    )}
  </>
)

const MessageActions = ({
  message,
  actionState,
  dropdownRef,
  editContent,
  messageId,
  editMessage,
  deleteMessage,
  setEditContent,
  setShowDropdown,
  setShowEditModal
}: {
  message: ChatMessage
  actionState: {
    side: "sender" | "recipient"
    delivery: "sending" | "failed" | "sent"
    dropdown: "open" | "closed"
    editor: "open" | "closed"
    editAvailability: "available" | "hidden"
    contentKind: "file" | "text"
  }
  dropdownRef: RefObject<HTMLDivElement | null>
  editContent: string
  messageId: string
  editMessage: (variables: { messageId: string; content: string; field?: "content" | "caption" }) => void
  deleteMessage: (messageId: string) => void
  setEditContent: Dispatch<SetStateAction<string>>
  setShowDropdown: Dispatch<SetStateAction<boolean>>
  setShowEditModal: Dispatch<SetStateAction<boolean>>
}) => (
  <div>
    {actionState.delivery === "sent" && (
      <button
        type="button"
        className={`absolute top-1/2 hidden -translate-y-1/2 transform cursor-pointer group-hover:block ${
          actionState.side === "sender" ? "-left-5" : "-right-4"
        }`}
        onClick={() => setShowDropdown((prev) => !prev)}
        aria-label="Open message actions"
      >
        <MoreIcon />
      </button>
    )}

    {actionState.dropdown === "open" && actionState.side === "sender" && (
      <MessageActionsMenu
        message={message}
        dropdownRef={dropdownRef}
        canEditMessage={actionState.editAvailability === "available"}
        isFileMessage={actionState.contentKind === "file"}
        deleteMessage={deleteMessage}
        setEditContent={setEditContent}
        setShowDropdown={setShowDropdown}
        setShowEditModal={setShowEditModal}
      />
    )}
    {actionState.editor === "open" && (
      <EditMessageModal
        setEditContent={setEditContent}
        editingMessageId={messageId}
        setShowEditModal={setShowEditModal}
        editMessage={editMessage}
        editContent={editContent ?? ""}
        editField={actionState.contentKind === "file" ? "caption" : "content"}
      />
    )}
  </div>
)

const MessageActionsMenu = ({
  message,
  dropdownRef,
  canEditMessage,
  isFileMessage,
  deleteMessage,
  setEditContent,
  setShowDropdown,
  setShowEditModal
}: {
  message: ChatMessage
  dropdownRef: RefObject<HTMLDivElement | null>
  canEditMessage: boolean
  isFileMessage: boolean
  deleteMessage: (messageId: string) => void
  setEditContent: Dispatch<SetStateAction<string>>
  setShowDropdown: Dispatch<SetStateAction<boolean>>
  setShowEditModal: Dispatch<SetStateAction<boolean>>
}) => (
  <div
    ref={dropdownRef}
    className="absolute top-0 -left-14 z-10 flex flex-col items-center rounded-md border bg-white px-2 py-1 shadow-lg"
  >
    {canEditMessage && (
      <button
        type="button"
        onClick={() => {
          setEditContent(isFileMessage ? (message.media?.caption ?? "") : (message.content ?? ""))
          setShowEditModal(true)
          setShowDropdown(false)
        }}
        className="w-full py-1 text-center text-sm text-gray-700 hover:bg-gray-100"
        aria-label="Edit message"
      >
        <EditIcon />
      </button>
    )}
    <button
      type="button"
      onClick={() => deleteMessage(message._id)}
      className="w-full py-1 text-left text-sm text-red-600 hover:bg-gray-100"
      aria-label="Delete message"
    >
      <DeleteIcon />
    </button>
  </div>
)

const MessageSeenStatus = ({
  message,
  lastMessage,
  currentUserId,
  conversationType,
  showSeenUsernames,
  setShowSeenUsernames
}: {
  message: ChatMessage
  lastMessage?: ChatMessage
  currentUserId: string
  conversationType?: "private" | "group"
  showSeenUsernames: boolean
  setShowSeenUsernames: Dispatch<SetStateAction<boolean>>
}) => {
  if (
    message?._id !== lastMessage?._id ||
    lastMessage?.sender !== currentUserId ||
    (lastMessage?.seenBy?.length ?? 0) === 0
  ) {
    return null
  }

  return (
    <div className="mt-2 flex flex-col items-end text-xs font-medium text-gray-600">
      {conversationType === "group" ? (
        <GroupSeenStatus
          seenBy={lastMessage.seenBy ?? []}
          showSeenUsernames={showSeenUsernames}
          setShowSeenUsernames={setShowSeenUsernames}
        />
      ) : (
        <>{getSeenText(lastMessage.seenBy?.[0]?.seenAt ?? new Date().toISOString())}</>
      )}
    </div>
  )
}

const GroupSeenStatus = ({
  seenBy,
  showSeenUsernames,
  setShowSeenUsernames
}: {
  seenBy: SeenUser[]
  showSeenUsernames: boolean
  setShowSeenUsernames: Dispatch<SetStateAction<boolean>>
}) => (
  <>
    <button
      type="button"
      className="flex cursor-pointer -space-x-2 bg-transparent p-0"
      onClick={() => setShowSeenUsernames((prev) => !prev)}
      title="Seen by"
      aria-label="Show seen by list"
    >
      {seenBy.map((seen) => (
        <img
          key={seen._id}
          src={seen.user?.profilePicture?.url || "/default-avatar.png"}
          alt={seen.user?.username}
          className="size-7 rounded-full border-2 border-white object-cover"
        />
      ))}
    </button>

    {showSeenUsernames && (
      <div className="animate-fadeIn mt-2 flex max-w-48 rounded bg-gray-100 px-2 py-1 transition-all duration-300 ease-in-out">
        <p>Seen by: </p>
        <ul className="flex flex-wrap justify-end text-right">
          {seenBy.map((seen, index) => (
            <li className="ml-1" key={seen._id}>
              {seen.user?.username}
              {index < seenBy.length - 1 && ", "}
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
)

const MoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
    />
  </svg>
)

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
)

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
)

export default Message
