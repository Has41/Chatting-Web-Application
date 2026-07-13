import type { User } from "@shared/types"
import type { CallLogEntry } from "@calls/types/callLogs"
import CallLogItem from "./CallLogItem"

interface CallLogListProps {
  logs: CallLogEntry[]
  openCallMenuId: string | null
  isChatListLoading: boolean
  canStartCall: boolean
  onOpenConversation: (peerId: string) => void
  onToggleCallMenu: (logId: string) => void
  onStartCall: (peer: User | undefined, peerId: string, type: "audio" | "video") => void
}

const CallLogList = ({
  logs,
  openCallMenuId,
  isChatListLoading,
  canStartCall,
  onOpenConversation,
  onToggleCallMenu,
  onStartCall
}: CallLogListProps) => (
  <div className="flex-1 overflow-y-auto px-3 py-4">
    <ul className="space-y-1.5">
      {logs.map((log) => (
        <CallLogItem
          key={log.id}
          log={log}
          isCallMenuOpen={openCallMenuId === log.id}
          isChatListLoading={isChatListLoading}
          canStartCall={canStartCall}
          onOpenConversation={onOpenConversation}
          onToggleCallMenu={onToggleCallMenu}
          onStartCall={onStartCall}
        />
      ))}
    </ul>
  </div>
)

export default CallLogList
