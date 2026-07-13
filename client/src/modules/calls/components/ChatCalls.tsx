import { useCallLogsQuery } from "@calls/queries/callLogQueries"
import type { CallLogEntry } from "@calls/types/callLogs"
import { useCallLogActions } from "@calls/hooks/useCallLogActions"
import CallLogsPanel from "./call-logs/CallLogsPanel"

const ChatCalls = () => {
  const {
    userId,
    callSocket,
    activeCallPeer,
    openCallMenuId,
    isChatListLoading,
    openConversation,
    toggleCallMenu,
    startCall
  } = useCallLogActions()
  const { data: callLogs } = useCallLogsQuery(userId)
  const logs: CallLogEntry[] = callLogs ?? []

  return (
    <CallLogsPanel
      logs={logs}
      callSocket={callSocket}
      activeCallPeer={activeCallPeer}
      openCallMenuId={openCallMenuId}
      isChatListLoading={isChatListLoading}
      onOpenConversation={openConversation}
      onToggleCallMenu={toggleCallMenu}
      onStartCall={startCall}
    />
  )
}

export default ChatCalls
