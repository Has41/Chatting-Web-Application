import type { RefObject } from "react"
import { Loader2 } from "lucide-react"
import type { User } from "@shared/types"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import TypingIndicator from "@/modules/chat/conversations/components/messages/TypingIndicator"
import type { ChannelTypingUser } from "../../hooks/useChannelSocket"
import type { ChannelMessage } from "../../types/channelChat"
import ChannelEmptyState from "./ChannelEmptyState"
import ChannelMessageBubble from "./ChannelMessageBubble"

interface ChannelMessagesPanelProps {
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
}

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
}: ChannelMessagesPanelProps) => (
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

export default ChannelMessagesPanel
