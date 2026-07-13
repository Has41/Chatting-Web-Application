import GroupChatHeader from "./GroupChatHeader"
import GroupChatSidebar from "./GroupChatSidebar"
import GroupChatMessages from "./GroupChatMessages"
import GroupChatComposer from "./GroupChatComposer"
import { useGroupChatbox } from "@chat/conversations/hooks/useGroupChatbox"

const GroupChatbox = () => {
  const { user, conversationId, state, groupData, lastMessage, socket, setMessages, setGroupData, handlers } =
    useGroupChatbox()

  if (!user) return null

  return (
    <section className="font-poppins relative flex h-screen w-[69%] flex-col">
      <GroupChatHeader groupData={groupData} onOpenInfo={handlers.toggleSidebar} />

      <GroupChatSidebar
        isOpen={state.isSidebarOpen}
        groupData={groupData}
        conversationId={conversationId}
        setGroupData={setGroupData}
        onClose={handlers.closeSidebar}
      />

      <GroupChatMessages
        lastMessage={lastMessage}
        setMessages={setMessages}
        conversationId={conversationId}
        groupData={groupData}
        socketMessages={state.messages}
        socketRef={socket.socketRef}
        typingUsers={socket.typingUsers}
      />

      <GroupChatComposer
        sendMessage={socket.sendMessage}
        setMessages={setMessages}
        conversationId={conversationId}
        socketRef={socket.socketRef}
        messageContent={state.messageContent}
        setMessageContent={handlers.setMessageContent}
        onTypingStart={handlers.emitGroupTypingStart}
        onTypingStop={handlers.emitGroupTypingStop}
      />
    </section>
  )
}

export default GroupChatbox
