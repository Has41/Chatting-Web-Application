import type { User } from "@shared/types"
import type { CallLogEntry } from "@calls/types/callLogs"
import AudioCallPanel from "@calls/components/AudioCallPanel"
import type useCallSocket from "@calls/socket/useCallSocket"
import CallLogList from "./CallLogList"
import EmptyCallLogs from "./EmptyCallLogs"

interface CallLogsPanelProps {
  logs: CallLogEntry[]
  callSocket: ReturnType<typeof useCallSocket>
  activeCallPeer: User | null
  openCallMenuId: string | null
  isChatListLoading: boolean
  onOpenConversation: (peerId: string) => void
  onToggleCallMenu: (logId: string) => void
  onStartCall: (peer: User | undefined, peerId: string, type: "audio" | "video") => void
}

const CallLogsPanel = ({
  logs,
  callSocket,
  activeCallPeer,
  openCallMenuId,
  isChatListLoading,
  onOpenConversation,
  onToggleCallMenu,
  onStartCall
}: CallLogsPanelProps) => (
  <aside
    className="font-poppins relative h-screen w-1/4 min-w-72 border-r border-l border-slate-200 bg-[#f8fbf8]"
    aria-label="Chat Calls"
  >
    <section className="flex h-full flex-col">
      <div className="border-b border-black/5 bg-white px-5 py-5">
        <h2 className="text-xl font-semibold text-[#18251b]">Calls</h2>
        <p className="mt-1 text-sm font-medium text-[#65786a]">Recent audio and video activity.</p>
      </div>

      {logs.length > 0 ? (
        <CallLogList
          logs={logs}
          openCallMenuId={openCallMenuId}
          isChatListLoading={isChatListLoading}
          canStartCall={callSocket.status === "idle"}
          onOpenConversation={onOpenConversation}
          onToggleCallMenu={onToggleCallMenu}
          onStartCall={onStartCall}
        />
      ) : (
        <EmptyCallLogs />
      )}
    </section>
    <AudioCallPanel
      status={callSocket.status}
      callType={callSocket.callType}
      remoteStream={callSocket.remoteStream}
      localStream={callSocket.localStream}
      peer={activeCallPeer}
      error={callSocket.error}
      isMuted={callSocket.isMuted}
      isCameraOff={callSocket.isCameraOff}
      onAccept={callSocket.acceptCall}
      onReject={callSocket.rejectCall}
      onEnd={callSocket.endCall}
      onToggleMute={callSocket.toggleMute}
      onToggleCamera={callSocket.toggleCamera}
    />
  </aside>
)

export default CallLogsPanel
