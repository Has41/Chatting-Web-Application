import { useChannelChatbox } from "../hooks/useChannelChatbox"
import ChannelInfoSidebar from "./ChannelInfoSidebar"
import { ChannelLoadingState, ChannelPickerState, ChannelUnavailableState } from "./channel-chat/ChannelChatboxState"
import ChannelComposerFooter from "./channel-chat/ChannelComposerFooter"
import ChannelHeader from "./channel-chat/ChannelHeader"
import ChannelMessagesPanel from "./channel-chat/ChannelMessagesPanel"

const ChannelChatbox = () => {
  const chatbox = useChannelChatbox()
  const { channelId, channel, channelQuery, messagesQuery, joinChannel, user, composer } = chatbox
  const { isChannelMember, canSendInChannel, isPublicPreview } = chatbox.permissions
  const { handleJoinChannel } = chatbox.actions

  if (!channelId) {
    return <ChannelPickerState />
  }

  if (channelQuery.isLoading) {
    return <ChannelLoadingState />
  }

  if (!channel) {
    return <ChannelUnavailableState />
  }

  return (
    <section className="flex h-screen min-w-0 flex-1 flex-col bg-[#f8fbf8]">
      <ChannelHeader
        channel={channel}
        VisibilityIcon={chatbox.VisibilityIcon}
        isPublicPreview={isPublicPreview}
        isJoining={joinChannel.isPending}
        onOpenInfo={() => chatbox.actions.setIsInfoOpen(true)}
        onJoin={handleJoinChannel}
      />

      <ChannelInfoSidebar
        isOpen={chatbox.isInfoOpen}
        onClose={() => chatbox.actions.setIsInfoOpen(false)}
        channel={channel}
      />

      <ChannelMessagesPanel
        isLoading={messagesQuery.isLoading}
        messages={chatbox.messages}
        typingUsers={chatbox.typingUsers}
        typingMember={chatbox.typingMember}
        currentUserId={user?._id}
        channelId={channelId}
        mediaGallery={chatbox.mediaGallery}
        isPublicPreview={isPublicPreview}
        canReactInChannel={isChannelMember}
        bottomRef={chatbox.bottomRef}
        onUpdateMessage={chatbox.actions.updateMessageInCache}
        onRemoveMessage={chatbox.actions.removeMessageFromCache}
        onReactToMessage={chatbox.actions.reactToMessage}
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

export default ChannelChatbox
