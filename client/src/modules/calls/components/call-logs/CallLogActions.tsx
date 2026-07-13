import { MessageCircle, Phone, Video } from "lucide-react"
import type { User } from "@shared/types"

interface CallLogActionsProps {
  logId: string
  peer?: User
  peerId: string
  peerName: string
  isCallMenuOpen: boolean
  isChatListLoading: boolean
  canStartCall: boolean
  onOpenConversation: (peerId: string) => void
  onToggleCallMenu: (logId: string) => void
  onStartCall: (peer: User | undefined, peerId: string, type: "audio" | "video") => void
}

const CallLogActions = ({
  logId,
  peer,
  peerId,
  peerName,
  isCallMenuOpen,
  isChatListLoading,
  canStartCall,
  onOpenConversation,
  onToggleCallMenu,
  onStartCall
}: CallLogActionsProps) => (
  <>
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onOpenConversation(peerId)}
        disabled={isChatListLoading}
        className="inline-flex size-8 items-center justify-center rounded-full text-[#35513a] transition hover:bg-[#e5f8e8] focus:outline-none focus:ring-2 focus:ring-[#96e6a1] disabled:cursor-wait disabled:opacity-40"
        aria-label={`Open chat with ${peerName}`}
        title="Open chat"
      >
        <MessageCircle className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onToggleCallMenu(logId)}
        disabled={!canStartCall}
        className="inline-flex size-8 items-center justify-center rounded-full text-[#35513a] transition hover:bg-[#e5f8e8] focus:outline-none focus:ring-2 focus:ring-[#96e6a1] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={`Call ${peerName}`}
        aria-expanded={isCallMenuOpen}
        title="Call"
      >
        <Phone className="size-4" />
      </button>
    </div>

    {isCallMenuOpen && (
      <div className="absolute right-3 top-12 z-20 flex items-center gap-1 rounded-full border border-black/5 bg-white p-1 shadow-lg">
        <button
          type="button"
          onClick={() => onStartCall(peer, peerId, "audio")}
          className="inline-flex size-8 items-center justify-center rounded-full text-[#35513a] transition hover:bg-[#e5f8e8] focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
          aria-label={`Start audio call with ${peerName}`}
          title="Audio call"
        >
          <Phone className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onStartCall(peer, peerId, "video")}
          className="inline-flex size-8 items-center justify-center rounded-full text-[#35513a] transition hover:bg-[#e5f8e8] focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
          aria-label={`Start video call with ${peerName}`}
          title="Video call"
        >
          <Video className="size-4" />
        </button>
      </div>
    )}
  </>
)

export default CallLogActions
