import { AlertCircle, Loader2, Send } from "lucide-react"
import { formatTime } from "@shared/utils/dateTime"
import FileMessagePreview from "@chat/attachments/components/FileMessagePreview"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import EditMessageModal from "@chat/messages/components/EditMessageModal"
import MessageReactions from "@chat/messages/components/MessageReactions"
import { useChannelMessageActions } from "../../hooks/useChannelMessageActions"
import type { ChannelMessage } from "../../types/channelChat"
import { getAvatarUrl, getSender, getSenderId } from "../../utils/channelChat"
import ChannelMessageActions from "./ChannelMessageActions"

interface ChannelMessageBubbleProps {
  message: ChannelMessage
  currentUserId?: string
  mediaGallery: MediaViewerItem[]
  mediaGalleryIndex: number
  channelId: string
  onUpdateMessage: (messageId: string, updater: (message: ChannelMessage) => ChannelMessage) => void
  onRemoveMessage: (messageId: string) => void
  onReactToMessage: (payload: { messageId: string; emoji: string }) => void
  canReactInChannel: boolean
}

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
}: ChannelMessageBubbleProps) => {
  const sender = getSender(message.sender)
  const isMine = currentUserId ? getSenderId(message.sender) === currentUserId : false
  const avatarUrl = getAvatarUrl(sender)
  const displayName = sender?.displayName || sender?.username || "Member"
  const isFileMessage = message.messageType === "file"
  const canEditMessage = isMine && (!isFileMessage || !!message.media?.caption?.trim())
  const canUseActions = isMine && message.localStatus !== "sending" && message.localStatus !== "failed"
  const canReact = canReactInChannel && message.localStatus !== "sending" && message.localStatus !== "failed"
  const messageActions = useChannelMessageActions({
    message,
    channelId,
    currentUserId,
    canReact,
    isFileMessage,
    onUpdateMessage,
    onRemoveMessage,
    onReactToMessage
  })

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
            <ChannelMessageActions
              canEditMessage={canEditMessage}
              showActions={messageActions.state.showActions}
              onToggleActions={messageActions.handlers.toggleActions}
              onOpenEditModal={messageActions.handlers.openEditModal}
              onDeleteMessage={messageActions.handlers.deleteMessage}
            />
          )}
          {messageActions.state.showEditModal && (
            <EditMessageModal
              setEditContent={messageActions.handlers.setEditContent}
              editingMessageId={message._id}
              setShowEditModal={messageActions.handlers.setShowEditModal}
              editMessage={messageActions.handlers.editMessage}
              editContent={messageActions.state.editContent}
              editField={isFileMessage ? "caption" : "content"}
            />
          )}
          {messageActions.state.isUpdating && (
            <div className="absolute top-full mt-1 flex items-center gap-1 px-1 text-[11px] text-slate-500">
              <Loader2 size={11} className="animate-spin" />
              Updating
            </div>
          )}
        </div>
        <MessageReactions
          reactions={message.reactions}
          currentUserId={currentUserId}
          disabled={!canReact}
          align={isMine ? "right" : "left"}
          onReact={messageActions.handlers.handleReact}
        />
      </div>
    </div>
  )
}

export default ChannelMessageBubble
