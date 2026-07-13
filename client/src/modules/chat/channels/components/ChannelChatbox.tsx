import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction
} from "react"
import { AlertCircle, Hash, Loader2, Lock, MoreVertical, Paperclip, Pencil, Send, Trash2, Users } from "lucide-react"
import { useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAuth from "@auth/hooks/useAuth"
import { channelKeys, useChannel, useJoinChannel } from "../queries/useChannels"
import { useChannelMessages } from "../queries/useChannelMessages"
import { useChannelSocket, type ChannelTypingUser, type SendChannelMessagePayload } from "../hooks/useChannelSocket"
import axiosInstance from "@shared/api/api-client"
import { MESSAGE_PATHS } from "@shared/constants/apiPaths"
import { formatTime } from "@shared/utils/dateTime"
import type { Channel, Message, User } from "@shared/types"
import type { FileType, SendMessagePayload } from "@chat/attachments/types/attachments"
import AttachmentMenu from "@chat/composer/components/AttachmentMenu"
import FilePreviewModal from "@chat/attachments/components/FilePreviewModal"
import FileMessagePreview from "@chat/attachments/components/FileMessagePreview"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import ChannelInfoSidebar from "./ChannelInfoSidebar"
import EditMessageModal from "@chat/messages/components/EditMessageModal"
import TypingIndicator from "@/modules/chat/conversations/components/messages/TypingIndicator"
import MessageReactions from "@chat/messages/components/MessageReactions"

type ChannelMessage = Message & {
  channel?: string
  clientTempId?: string
  localStatus?: "sending" | "failed"
}

interface ChannelMessagesCache {
  pages: Array<{ messages: ChannelMessage[] }>
}

type EditChannelMessageVariables = {
  messageId: string
  content: string
  field?: "content" | "caption"
}

const getSender = (sender: string | User): User | null => (typeof sender === "string" ? null : sender)

const getSenderId = (sender: string | User): string => (typeof sender === "string" ? sender : sender._id)

const getChannelUserId = (value?: string | User | null) => (typeof value === "string" ? value : value?._id)

const getAvatarUrl = (user?: User | null) => user?.profilePicture?.url || user?.avatar || ""

const createTempMessageId = () => `temp-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`

const getAcceptedTypes = (type: FileType | null) => {
  switch (type) {
    case "image":
      return "image/*"
    case "video":
      return "video/*"
    case "document":
      return ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
    case "audio":
      return "audio/*"
    default:
      return "*"
  }
}

interface AttachmentPickerState {
  type: FileType | null
  requestId: number
}

const attachmentPickerReducer = (_state: AttachmentPickerState, type: FileType): AttachmentPickerState => ({
  type,
  requestId: _state.requestId + 1
})

const ChannelChatbox = () => {
  const { channelId } = useParams()
  const { user } = useAuth()
  const [liveMessages, setLiveMessages] = useState<ChannelMessage[]>([])
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  const channelQuery = useChannel(channelId)
  const messagesQuery = useChannelMessages(channelId)
  const joinChannel = useJoinChannel()
  const channel = channelQuery.data as Channel | undefined
  const isChannelMember = Boolean(
    channel && user?._id && channel.members.some((member) => getChannelUserId(member) === user._id)
  )
  const currentUserIsChannelAdmin = Boolean(
    channel &&
    user?._id &&
    (getChannelUserId(channel.owner) === user._id || channel.admins.some((admin) => getChannelUserId(admin) === user._id))
  )
  const canSendInChannel =
    isChannelMember && ((channel?.sendPermissions || "admins") === "members" || currentUserIsChannelAdmin)
  const isPublicPreview = Boolean(channel && channel.visibility === "public" && !isChannelMember)
  const { sendChannelMessage, reactToMessage, typingUsers, emitTypingStart, emitTypingStop } = useChannelSocket({
    channelId,
    userId: user?._id,
    enabled: isChannelMember,
    setMessages: setLiveMessages
  })

  const fetchedMessages = useMemo<ChannelMessage[]>(
    () => messagesQuery.data?.pages.flatMap((page: { messages: Message[] }) => page.messages as ChannelMessage[]) ?? [],
    [messagesQuery.data]
  )

  const messages = useMemo(() => {
    const byId = new Map<string, ChannelMessage>()
    const addMessage = (message: ChannelMessage) => {
      const stableKey = message.clientTempId || message._id
      const existingKey = Array.from(byId.entries()).find(
        ([, value]) => value._id === message._id || (message.clientTempId && value.clientTempId === message.clientTempId)
      )?.[0]

      if (existingKey) {
        byId.set(existingKey, { ...byId.get(existingKey), ...message })
      } else {
        byId.set(stableKey, message)
      }
    }

    fetchedMessages.forEach(addMessage)
    liveMessages.forEach(addMessage)

    return Array.from(byId.values()).sort(
      (first, second) => new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
    )
  }, [fetchedMessages, liveMessages])

  const mediaGallery = useMemo<MediaViewerItem[]>(
    () =>
      messages.reduce<MediaViewerItem[]>((items, message) => {
        const mediaType = message.media?.mediaType
        if (message.messageType !== "file" || !message.media?.mediaUrl || (mediaType !== "image" && mediaType !== "video")) {
          return items
        }

        items.push({
          mediaUrl: message.media.mediaUrl,
          mediaType,
          title: message.media.caption || message.media.fileName || channel?.name
        })
        return items
      }, []),
    [channel?.name, messages]
  )
  const typingMember = useMemo(() => {
    const typingUserId = typingUsers[0]?.userId
    if (!typingUserId || !channel) return null
    const member = channel.members.find(
      (channelMember) => typeof channelMember !== "string" && channelMember._id === typingUserId
    )
    return typeof member === "string" ? null : (member ?? null)
  }, [channel, typingUsers])
  const composer = useChannelComposer({
    channelId,
    user,
    canSendInChannel,
    sendChannelMessage,
    emitTypingStart,
    emitTypingStop,
    setLiveMessages
  })

  const updateMessageInCache = (messageId: string, updater: (message: ChannelMessage) => ChannelMessage) => {
    queryClient.setQueryData<ChannelMessagesCache>(channelKeys.messages(channelId), (oldData) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          messages: page.messages.map((message: ChannelMessage) => (message._id === messageId ? updater(message) : message))
        }))
      }
    })

    setLiveMessages((prev) => prev.map((message) => (message._id === messageId ? updater(message) : message)))
  }

  const removeMessageFromCache = (messageId: string) => {
    queryClient.setQueryData<ChannelMessagesCache>(channelKeys.messages(channelId), (oldData) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          messages: page.messages.filter((message: ChannelMessage) => message._id !== messageId)
        }))
      }
    })

    setLiveMessages((prev) => prev.filter((message) => message._id !== messageId))
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, typingUsers.length])

  const handleJoinChannel = async () => {
    if (!channelId || joinChannel.isPending) return
    await joinChannel.mutateAsync(channelId)
  }

  if (!channelId) {
    return (
      <section className="flex h-screen flex-1 items-center justify-center bg-[#f8fbf8]">
        <p className="text-sm text-[#6c7d70]">Pick a channel to open the conversation.</p>
      </section>
    )
  }

  if (channelQuery.isLoading) {
    return (
      <section className="flex h-screen flex-1 items-center justify-center bg-[#f8fbf8]">
        <Loader2 className="animate-spin text-[#4f8f59]" size={26} />
      </section>
    )
  }

  if (!channel) {
    return (
      <section className="flex h-screen flex-1 items-center justify-center bg-[#f8fbf8] px-6 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#4f8f59] shadow-sm">
            <Hash size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#18251b]">Channel unavailable</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#6c7d70]">
            This channel might be private, deleted, or not available to your account.
          </p>
        </div>
      </section>
    )
  }

  const VisibilityIcon = channel.visibility === "private" ? Lock : Hash

  return (
    <section className="flex h-screen min-w-0 flex-1 flex-col bg-[#f8fbf8]">
      <ChannelHeader
        channel={channel}
        VisibilityIcon={VisibilityIcon}
        isPublicPreview={isPublicPreview}
        isJoining={joinChannel.isPending}
        onOpenInfo={() => setIsInfoOpen(true)}
        onJoin={handleJoinChannel}
      />

      <ChannelInfoSidebar isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} channel={channel} />

      <ChannelMessagesPanel
        isLoading={messagesQuery.isLoading}
        messages={messages}
        typingUsers={typingUsers}
        typingMember={typingMember}
        currentUserId={user?._id}
        channelId={channelId}
        mediaGallery={mediaGallery}
        isPublicPreview={isPublicPreview}
        canReactInChannel={isChannelMember}
        bottomRef={bottomRef}
        onUpdateMessage={updateMessageInCache}
        onRemoveMessage={removeMessageFromCache}
        onReactToMessage={reactToMessage}
      />

      <ChannelComposerFooter
        channelName={channel.name}
        channelId={channelId}
        messageText={composer.messageText}
        attachmentType={composer.attachmentType}
        previewFile={composer.previewFile}
        composerState={{
          attachmentMenu: composer.showAttachmentOptions ? "open" : "closed",
          permission: canSendInChannel ? "allowed" : "blocked",
          previewMode: isPublicPreview ? "public" : "member",
          join: joinChannel.isPending ? "pending" : "idle"
        }}
        fileInputRef={composer.fileInputRef}
        onJoin={handleJoinChannel}
        onSubmit={composer.handleSubmit}
        onMessageChange={composer.handleMessageInputChange}
        onFileChange={composer.handleFileChange}
        onSendFile={composer.handleSendFile}
        onCancelPreview={() => composer.setPreviewFile(null)}
        onAttachmentSelect={composer.handleAttachmentSelect}
        setShowAttachmentOptions={composer.setShowAttachmentOptions}
      />
    </section>
  )
}

const useChannelComposer = ({
  channelId,
  user,
  canSendInChannel,
  sendChannelMessage,
  emitTypingStart,
  emitTypingStop,
  setLiveMessages
}: {
  channelId?: string
  user?: User | null
  canSendInChannel: boolean
  sendChannelMessage: (payload: SendChannelMessagePayload) => void
  emitTypingStart: (payload: { channelId: string; username?: string }) => void
  emitTypingStop: (payload: { channelId: string; username?: string }) => void
  setLiveMessages: Dispatch<SetStateAction<ChannelMessage[]>>
}) => {
  const [messageText, updateMessageText] = useReducer((_current: string, value: string) => value, "")
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [attachmentPicker, requestAttachmentPicker] = useReducer(attachmentPickerReducer, { type: null, requestId: 0 })
  const attachmentType = attachmentPicker.type
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const attachmentTypeRef = useRef<FileType | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const lastTypingPulseRef = useRef(0)

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    if (!isTypingRef.current || !channelId) return

    isTypingRef.current = false
    emitTypingStop({ channelId, username: user?.username })
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      if (isTypingRef.current && channelId) {
        emitTypingStop({ channelId, username: user?.username })
      }
    }
  }, [channelId, emitTypingStop, user?.username])

  useEffect(() => {
    if (!attachmentPicker.type || attachmentPicker.requestId === 0) return
    fileInputRef.current?.setAttribute("accept", getAcceptedTypes(attachmentPicker.type))
    fileInputRef.current?.click()
  }, [attachmentPicker])

  const handleMessageInputChange = (value: string) => {
    if (!canSendInChannel) return

    if (!value.trim() || !channelId) {
      stopTyping()
      updateMessageText(value)
      return
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true
      lastTypingPulseRef.current = Date.now()
      emitTypingStart({ channelId, username: user?.username })
    } else if (Date.now() - lastTypingPulseRef.current > 1200) {
      lastTypingPulseRef.current = Date.now()
      emitTypingStart({ channelId, username: user?.username })
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 2200)

    updateMessageText(value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = messageText.trim()
    if (!content || !channelId || !user?._id || !canSendInChannel) return

    const clientTempId = createTempMessageId()
    const optimisticMessage: ChannelMessage = {
      _id: clientTempId,
      conversationId: channelId,
      channel: channelId,
      sender: user,
      content,
      messageType: "text",
      clientTempId,
      localStatus: "sending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLiveMessages((prev) => [...prev, optimisticMessage])
    updateMessageText("")
    stopTyping()
    sendChannelMessage({
      channelId,
      sender: user._id,
      content,
      messageType: "text",
      clientTempId
    })
  }

  const handleAttachmentSelect = (type: FileType) => {
    if (!canSendInChannel) return

    attachmentTypeRef.current = type
    requestAttachmentPicker(type)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canSendInChannel) {
      event.target.value = ""
      return
    }

    const file = event.target.files?.[0]
    if (!file) return

    event.target.value = ""
    setPreviewFile(file)
  }

  const handleSendFile = ({
    fileMeta = null,
    clientTempId,
    optimisticOnly = false,
    markFailed = false
  }: SendMessagePayload) => {
    if (!channelId || !user?._id || !clientTempId || !canSendInChannel) return

    if (markFailed) {
      setLiveMessages((prev) =>
        prev.map((message) =>
          message.clientTempId === clientTempId || message._id === clientTempId
            ? { ...message, localStatus: "failed" }
            : message
        )
      )
      return
    }

    if (!fileMeta) return

    const optimisticMessage: ChannelMessage = {
      _id: clientTempId,
      conversationId: channelId,
      channel: channelId,
      sender: user,
      content: "",
      messageType: "file",
      clientTempId,
      localStatus: "sending",
      media: {
        publicId: fileMeta.public_url,
        mediaUrl: fileMeta.media_url,
        caption: fileMeta.caption || "",
        thumbnailUrl: fileMeta.thumbnailUrl || "",
        mediaType: fileMeta.mediaType || attachmentTypeRef.current || undefined,
        mimeType: fileMeta.mimeType || "",
        fileName: fileMeta.fileName || ""
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLiveMessages((prev) => {
      const existingIndex = prev.findIndex(
        (message) => message.clientTempId === clientTempId || message._id === clientTempId
      )
      if (existingIndex === -1) return [...prev, optimisticMessage]

      return prev.map((message, index) =>
        index === existingIndex
          ? {
              ...message,
              media: optimisticMessage.media,
              localStatus: "sending"
            }
          : message
      )
    })

    if (optimisticOnly) return

    sendChannelMessage({
      channelId,
      sender: user._id,
      messageType: "file",
      fileData: {
        publicId: fileMeta.public_url,
        url: fileMeta.media_url,
        caption: fileMeta.caption || "",
        thumbnailUrl: fileMeta.thumbnailUrl || "",
        mediaType: fileMeta.mediaType || attachmentTypeRef.current || undefined,
        mimeType: fileMeta.mimeType || "",
        fileName: fileMeta.fileName || ""
      },
      clientTempId
    })
  }

  return {
    messageText,
    attachmentType,
    previewFile,
    showAttachmentOptions,
    fileInputRef,
    setPreviewFile,
    setShowAttachmentOptions,
    handleSubmit,
    handleMessageInputChange,
    handleFileChange,
    handleSendFile,
    handleAttachmentSelect
  }
}

const ChannelHeader = ({
  channel,
  VisibilityIcon,
  isPublicPreview,
  isJoining,
  onOpenInfo,
  onJoin
}: {
  channel: Channel
  VisibilityIcon: typeof Hash
  isPublicPreview: boolean
  isJoining: boolean
  onOpenInfo: () => void
  onJoin: () => void
}) => (
  <header className="flex min-h-19.5 items-center justify-between border-b border-black/5 bg-white px-5 shadow-sm">
    <button
      type="button"
      onClick={onOpenInfo}
      className="flex min-w-0 items-center gap-3 rounded-lg text-left transition hover:bg-slate-50 focus:ring-2 focus:ring-[#96e6a1] focus:outline-none"
      aria-label="Open channel info"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#e5f8e8] text-[#2f733c]">
        {channel.avatar?.url ? (
          <img src={channel.avatar.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <VisibilityIcon size={22} />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-[#18251b]">{channel.name}</h1>
          {channel.visibility === "private" && <Lock size={15} className="shrink-0 text-[#8a9a8d]" />}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-[#65786a]">
          <Users size={14} />
          <span>{channel.members.length} members</span>
          {channel.description && (
            <>
              <span className="h-1 w-1 rounded-full bg-[#a3b0a6]" />
              <span className="truncate">{channel.description}</span>
            </>
          )}
        </div>
      </div>
    </button>
    {isPublicPreview && <JoinChannelButton label="Join" isJoining={isJoining} onJoin={onJoin} className="ml-4" />}
  </header>
)

const ChannelMessagesPanel = ({
  isLoading,
  messages,
  typingUsers,
  typingMember,
  currentUserId,
  channelId,
  mediaGallery,
  isPublicPreview,
  canReactInChannel,
  bottomRef,
  onUpdateMessage,
  onRemoveMessage,
  onReactToMessage
}: {
  isLoading: boolean
  messages: ChannelMessage[]
  typingUsers: ChannelTypingUser[]
  typingMember: User | null
  currentUserId?: string
  channelId: string
  mediaGallery: MediaViewerItem[]
  isPublicPreview: boolean
  canReactInChannel: boolean
  bottomRef: RefObject<HTMLDivElement | null>
  onUpdateMessage: (messageId: string, updater: (message: ChannelMessage) => ChannelMessage) => void
  onRemoveMessage: (messageId: string) => void
  onReactToMessage: (payload: { messageId: string; emoji: string }) => void
}) => (
  <div className="flex-1 overflow-y-auto px-5 py-6">
    {isLoading ? (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-[#4f8f59]" size={24} />
      </div>
    ) : messages.length > 0 || typingUsers.length > 0 ? (
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.map((message) => {
          const galleryIndex = mediaGallery.findIndex((item) => item.mediaUrl === message.media?.mediaUrl)

          return (
            <ChannelMessageBubble
              key={message.clientTempId || message._id}
              message={message}
              currentUserId={currentUserId}
              mediaGallery={mediaGallery}
              mediaGalleryIndex={galleryIndex}
              channelId={channelId}
              onUpdateMessage={onUpdateMessage}
              onRemoveMessage={onRemoveMessage}
              onReactToMessage={onReactToMessage}
              canReactInChannel={canReactInChannel}
            />
          )
        })}
        <TypingIndicator
          typingUsers={typingUsers}
          avatarUrl={typingMember?.profilePicture?.url || typingMember?.avatar}
          avatarLabel={typingMember?.displayName || typingMember?.username || typingUsers[0]?.username}
        />
        <div ref={bottomRef} />
      </div>
    ) : (
      <ChannelEmptyState isPublicPreview={isPublicPreview} />
    )}
  </div>
)

const ChannelEmptyState = ({ isPublicPreview }: { isPublicPreview: boolean }) => (
  <div className="flex h-full items-center justify-center text-center">
    <div>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-white text-[#4f8f59] shadow-sm">
        <Hash size={28} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[#18251b]">Start the channel</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#6c7d70]">
        {isPublicPreview
          ? "This public channel is open to preview. Join when you want to take part."
          : "Send the first message and this space will come alive for everyone inside it."}
      </p>
    </div>
  </div>
)

const ChannelComposerFooter = ({
  channelName,
  channelId,
  messageText,
  attachmentType,
  previewFile,
  composerState,
  fileInputRef,
  onJoin,
  onSubmit,
  onMessageChange,
  onFileChange,
  onSendFile,
  onCancelPreview,
  onAttachmentSelect,
  setShowAttachmentOptions
}: {
  channelName: string
  channelId: string
  messageText: string
  attachmentType: FileType | null
  previewFile: File | null
  composerState: {
    attachmentMenu: "open" | "closed"
    permission: "allowed" | "blocked"
    previewMode: "public" | "member"
    join: "pending" | "idle"
  }
  fileInputRef: RefObject<HTMLInputElement | null>
  onJoin: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onMessageChange: (value: string) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSendFile: (payload: SendMessagePayload) => void
  onCancelPreview: () => void
  onAttachmentSelect: (type: FileType) => void
  setShowAttachmentOptions: Dispatch<SetStateAction<boolean>>
}) => (
  <footer className="border-t border-black/5 bg-white px-5 py-4">
    <div className="relative mx-auto max-w-3xl">
      {composerState.previewMode === "public" ? (
        <PublicPreviewJoinPrompt joinState={composerState.join} onJoin={onJoin} />
      ) : (
        composerState.permission === "blocked" && <AdminOnlyNotice />
      )}
      {composerState.previewMode === "member" && (
        <>
          {previewFile && (
            <FilePreviewModal
              file={previewFile}
              type={attachmentType ?? "document"}
              conversationId={channelId}
              conversationType="channel"
              onSend={onSendFile}
              onCancel={onCancelPreview}
            />
          )}
          <form onSubmit={onSubmit} className="flex items-end gap-3">
            {composerState.attachmentMenu === "open" && (
              <AttachmentMenu
                onSelect={(type) => {
                  onAttachmentSelect(type)
                  setShowAttachmentOptions(false)
                }}
                onClose={() => setShowAttachmentOptions(false)}
              />
            )}
            <button
              type="button"
              onClick={() => setShowAttachmentOptions((prev) => !prev)}
              disabled={composerState.permission === "blocked"}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#506856] transition hover:bg-[#f1f6f2] focus:ring-2 focus:ring-[#96e6a1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={getAcceptedTypes(attachmentType)}
              onChange={onFileChange}
            />
            <div className="flex min-h-12 flex-1 items-center rounded-3xl bg-[#f1f6f2] px-4 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-[#96e6a1]">
              <textarea
                value={messageText}
                onChange={(event) => onMessageChange(event.target.value)}
                onKeyDown={(event) => {
                  if (composerState.permission === "blocked") return
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
                disabled={composerState.permission === "blocked"}
                rows={1}
                aria-label={`Message ${channelName}`}
                placeholder={composerState.permission === "allowed" ? `Message ${channelName}` : "Admins only"}
                className="max-h-32 min-h-6 w-full resize-none bg-transparent py-3 text-sm text-[#18251b] outline-none placeholder:text-[#9aa99d] disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={!messageText.trim() || composerState.permission === "blocked"}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#96e6a1] text-[#102315] shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send channel message"
            >
              <Send size={20} />
            </button>
          </form>
        </>
      )}
    </div>
  </footer>
)

const PublicPreviewJoinPrompt = ({ joinState, onJoin }: { joinState: "pending" | "idle"; onJoin: () => void }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f1f6f2] px-4 py-3 ring-1 ring-black/5">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[#18251b]">Previewing public channel</p>
      <p className="mt-1 text-xs font-medium text-[#65786a]">Join to send messages, files, and typing updates.</p>
    </div>
    <JoinChannelButton label="Join channel" isJoining={joinState === "pending"} onJoin={onJoin} />
  </div>
)

const AdminOnlyNotice = () => (
  <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
    <Lock size={14} />
    Only channel admins can send messages here.
  </div>
)

const JoinChannelButton = ({
  label,
  isJoining,
  onJoin,
  className = ""
}: {
  label: string
  isJoining: boolean
  onJoin: () => void
  className?: string
}) => (
  <button
    type="button"
    onClick={onJoin}
    disabled={isJoining}
    className={`${className} flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#96e6a1] px-4 text-sm font-semibold text-[#102315] transition hover:bg-[#84dc91] focus:ring-2 focus:ring-[#96e6a1] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60`}
  >
    {isJoining ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
    {label}
  </button>
)

const ChannelMessageBubble = ({
  message,
  currentUserId,
  mediaGallery,
  mediaGalleryIndex,
  channelId,
  onUpdateMessage,
  onRemoveMessage,
  onReactToMessage,
  canReactInChannel
}: {
  message: ChannelMessage
  currentUserId?: string
  mediaGallery: MediaViewerItem[]
  mediaGalleryIndex: number
  channelId: string
  onUpdateMessage: (messageId: string, updater: (message: ChannelMessage) => ChannelMessage) => void
  onRemoveMessage: (messageId: string) => void
  onReactToMessage: (payload: { messageId: string; emoji: string }) => void
  canReactInChannel: boolean
}) => {
  const sender = getSender(message.sender)
  const isMine = currentUserId ? getSenderId(message.sender) === currentUserId : false
  const avatarUrl = getAvatarUrl(sender)
  const displayName = sender?.displayName || sender?.username || "Member"
  const isFileMessage = message.messageType === "file"
  const canEditMessage = isMine && (!isFileMessage || !!message.media?.caption?.trim())
  const canUseActions = isMine && message.localStatus !== "sending" && message.localStatus !== "failed"
  const canReact = canReactInChannel && message.localStatus !== "sending" && message.localStatus !== "failed"
  const [showActions, setShowActions] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editContent, setEditContent] = useState(isFileMessage ? (message.media?.caption ?? "") : (message.content ?? ""))
  const queryClient = useQueryClient()

  const editMessage = useMutation({
    mutationFn: async ({
      messageId,
      content,
      field = "content"
    }: {
      messageId: string
      content: string
      field?: "content" | "caption"
    }) => {
      return axiosInstance.patch(`${MESSAGE_PATHS.EDIT_MESSAGE}/${messageId}`, {
        [field === "caption" ? "caption" : "content"]: content
      })
    },
    onMutate: ({ messageId, content, field = "content" }: EditChannelMessageVariables) => {
      onUpdateMessage(messageId, (currentMessage) => ({
        ...currentMessage,
        content: field === "content" ? content : currentMessage.content,
        media: field === "caption" ? { ...currentMessage.media, caption: content } : currentMessage.media,
        editedAt: new Date().toISOString()
      }))
      setShowActions(false)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.messages(channelId) })
    },
    onError: (error: unknown) => {
      console.error("Error editing channel message:", error)
    }
  })

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      return axiosInstance.delete(`${MESSAGE_PATHS.DELETE_MESSAGE}/${messageId}`)
    },
    onMutate: (messageId: string) => {
      onRemoveMessage(messageId)
      setShowActions(false)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.messages(channelId) })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
    },
    onError: (error: unknown) => {
      console.error("Error deleting channel message:", error)
    }
  })

  const handleReact = (emoji: string) => {
    if (!canReact || !currentUserId) return

    onUpdateMessage(message._id, (currentMessage) => {
      const reactions = currentMessage.reactions ?? []
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
        existingReaction?.emoji === emoji ? reactionsWithoutMine : [...reactionsWithoutMine, { user: currentUserId, emoji }]

      return { ...currentMessage, reactions: nextReactions }
    })

    onReactToMessage({ messageId: message._id, emoji })
  }

  return (
    <div className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
      {!isMine && (
        <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[#dff3e3] text-xs font-semibold text-[#2f733c]">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            displayName.slice(0, 1).toUpperCase()
          )}
        </div>
      )}
      <div className={`max-w-[72%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
        {!isMine && <p className="mb-1 px-1 text-xs font-semibold text-[#5f7564]">{displayName}</p>}
        <div className={`group relative flex items-center gap-1 ${isMine ? "flex-row-reverse" : ""}`}>
          <div
            className={`rounded-[22px] shadow-sm ${
              isMine
                ? "rounded-br-md bg-[#96e6a1] text-[#102315]"
                : "rounded-bl-md bg-white text-[#18251b] ring-1 ring-black/5"
            } ${isFileMessage ? "p-2" : "px-4 py-3"}`}
          >
            {isFileMessage ? (
              <FileMessagePreview
                fileMeta={message.media ?? { mediaUrl: "" }}
                isSender={isMine}
                mediaGallery={mediaGallery}
                mediaGalleryIndex={mediaGalleryIndex}
              />
            ) : (
              <p className="text-sm leading-6 wrap-break-word whitespace-pre-wrap">{message.content || message.text}</p>
            )}
            <div
              className={`flex items-center gap-2 text-[11px] ${isFileMessage ? "mt-4 px-2 pb-1" : "mt-2"} ${
                isMine ? "justify-end text-[#315a38]" : "text-[#7a8a7d]"
              }`}
            >
              {message.editedAt && <span className="font-medium">Edited</span>}
              <span>{formatTime(message.createdAt, "upper")}</span>
              {message.localStatus === "sending" && (
                <span className="inline-flex items-center gap-1">
                  <Send size={11} />
                  Sending
                </span>
              )}
              {message.localStatus === "failed" && (
                <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                  <AlertCircle size={11} />
                  Failed
                </span>
              )}
            </div>
          </div>

          {canUseActions && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowActions((prev) => !prev)}
                className="grid size-7 place-items-center rounded-full text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-white hover:text-slate-700 focus:opacity-100 focus:ring-2 focus:ring-[#96e6a1] focus:outline-none"
                aria-label="Message actions"
              >
                <MoreVertical size={16} />
              </button>

              {showActions && (
                <div className="absolute top-8 right-0 z-20 min-w-32 overflow-hidden rounded-lg border border-slate-100 bg-white py-1 shadow-lg">
                  {canEditMessage && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditContent(isFileMessage ? (message.media?.caption ?? "") : (message.content ?? ""))
                        setShowEditModal(true)
                        setShowActions(false)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteMessage.mutate(message._id)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          {showEditModal && (
            <EditMessageModal
              setEditContent={setEditContent}
              editingMessageId={message._id}
              setShowEditModal={setShowEditModal}
              editMessage={editMessage.mutate}
              editContent={editContent}
              editField={isFileMessage ? "caption" : "content"}
            />
          )}
        </div>
        <MessageReactions
          reactions={message.reactions}
          currentUserId={currentUserId}
          disabled={!canReact}
          align={isMine ? "right" : "left"}
          onReact={handleReact}
        />
        {(editMessage.isPending || deleteMessage.isPending) && (
          <div className="mt-1 flex items-center gap-1 px-1 text-[11px] text-slate-500">
            <Loader2 size={11} className="animate-spin" />
            Updating
          </div>
        )}
      </div>
    </div>
  )
}

export default ChannelChatbox
