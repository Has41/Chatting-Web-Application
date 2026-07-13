import { ArrowDownLeft, ArrowUpRight, Phone, Video, X } from "lucide-react"
import type { User } from "@shared/types"
import type { CallLogEntry } from "@calls/types/callLogs"
import {
  formatCallDuration,
  formatCallStartedDay,
  formatCallStartedTime,
  getCallLogAvatarUrl,
  getCallLogStatusClassName,
  getCallLogStatusText,
  getCallLogUserName
} from "@calls/utils/callLogsDisplay"
import CallLogActions from "./CallLogActions"

interface CallLogItemProps {
  log: CallLogEntry
  isCallMenuOpen: boolean
  isChatListLoading: boolean
  canStartCall: boolean
  onOpenConversation: (peerId: string) => void
  onToggleCallMenu: (logId: string) => void
  onStartCall: (peer: User | undefined, peerId: string, type: "audio" | "video") => void
}

const CallLogItem = ({
  log,
  isCallMenuOpen,
  isChatListLoading,
  canStartCall,
  onOpenConversation,
  onToggleCallMenu,
  onStartCall
}: CallLogItemProps) => {
  const peer = log.peer
  const peerName = getCallLogUserName(peer)
  const avatarUrl = getCallLogAvatarUrl(peer)
  const DirectionIcon = log.direction === "outgoing" ? ArrowUpRight : ArrowDownLeft
  const TypeIcon = log.type === "video" ? Video : Phone
  const duration = formatCallDuration(log.durationSeconds)

  return (
    <li>
      <div className="relative flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-white">
        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e5f8e8] text-sm font-bold text-[#2f733c]">
          {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : peerName.slice(0, 1).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#18251b]">{peerName}</p>
            <TypeIcon className="size-3.5 shrink-0 text-[#65786a]" />
          </div>
          <div className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${getCallLogStatusClassName(log.status)}`}>
            {["missed", "declined", "unavailable", "failed"].includes(log.status) ? (
              <X className="size-3.5" />
            ) : (
              <DirectionIcon className="size-3.5" />
            )}
            <span className="truncate">{getCallLogStatusText(log)}</span>
            {duration && <span className="text-[#7a8a7d]">· {duration}</span>}
          </div>
        </div>

        <div className="shrink-0 text-right text-[11px] font-semibold text-[#7a8a7d]">
          <p>{formatCallStartedTime(log.startedAt)}</p>
          <p className="mt-1">{formatCallStartedDay(log.startedAt)}</p>
        </div>

        <CallLogActions
          logId={log.id}
          peer={peer}
          peerId={log.peerId}
          peerName={peerName}
          isCallMenuOpen={isCallMenuOpen}
          isChatListLoading={isChatListLoading}
          canStartCall={canStartCall}
          onOpenConversation={onOpenConversation}
          onToggleCallMenu={onToggleCallMenu}
          onStartCall={onStartCall}
        />
      </div>
    </li>
  )
}

export default CallLogItem
