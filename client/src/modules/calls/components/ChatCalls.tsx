import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowDownLeft, ArrowUpRight, Clock, MessageCircle, Phone, Search, Video, X } from "lucide-react"
import moment from "moment"
import useAuth from "@auth/hooks/useAuth"
import useChatList from "@chat/conversations/hooks/useChatList"
import useCallSocket from "@calls/socket/useCallSocket"
import AudioCallPanel from "@calls/components/AudioCallPanel"
import { CHAT_PAGE, getChatConversationRoute, getNewChatRoute } from "@shared/constants/routePaths"
import { useCallLogsQuery } from "@calls/queries/callLogQueries"
import type { CallLogEntry, CallLogStatus } from "@calls/types/callLogs"
import type { Conversation, User } from "@shared/types"

const getUserName = (user?: User) => user?.displayName || user?.username || "Member"

const getAvatarUrl = (user?: User) => user?.profilePicture?.url || user?.avatar || ""

const getStatusText = (log: CallLogEntry) => {
  if (log.status === "ended") return log.direction === "outgoing" ? "Outgoing call" : "Incoming call"
  if (log.status === "answered") return log.direction === "outgoing" ? "Calling..." : "Answered"
  if (log.status === "calling") return "Calling..."
  if (log.status === "missed") return "Missed call"
  if (log.status === "declined") return "Declined"
  if (log.status === "unavailable") return "Unavailable"
  return "Failed"
}

const getStatusClassName = (status: CallLogStatus) => {
  if (["missed", "declined", "unavailable", "failed"].includes(status)) return "text-red-500"
  if (status === "calling" || status === "answered") return "text-[#2f733c]"
  return "text-[#65786a]"
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return ""
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (!minutes) return `${remainingSeconds}s`
  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`
}

const getParticipantId = (participant: User | string) => (typeof participant === "string" ? participant : participant._id)

const getConversationRoute = (chatList: Conversation[], peerId: string) => {
  const existingConversation = chatList.find((conversation) => {
    const isPrivate = (conversation.conversationType || conversation.type) === "private"
    return isPrivate && conversation.participants?.some((participant) => getParticipantId(participant) === peerId)
  })

  return existingConversation ? getChatConversationRoute(existingConversation._id) : getNewChatRoute(peerId)
}

const ChatCalls = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { chatList, isLoading: isChatListLoading } = useChatList()
  const callSocket = useCallSocket(user?._id)
  const [openCallMenuId, setOpenCallMenuId] = useState<string | null>(null)
  const [activeCallPeer, setActiveCallPeer] = useState<User | null>(null)
  const { data: logs = [] } = useCallLogsQuery(user?._id)

  const openConversation = (peerId: string) => {
    if (isChatListLoading) return

    navigate(`${CHAT_PAGE}/${getConversationRoute(chatList, peerId)}`)
  }

  const startCall = (peer: User | undefined, peerId: string, type: "audio" | "video") => {
    setActiveCallPeer(peer || null)
    setOpenCallMenuId(null)

    if (type === "audio") {
      callSocket.startAudioCall(peerId)
      return
    }

    callSocket.startVideoCall(peerId)
  }

  return (
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
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1.5">
              {logs.map((log) => {
                const peer = log.peer
                const peerName = getUserName(peer)
                const avatarUrl = getAvatarUrl(peer)
                const DirectionIcon = log.direction === "outgoing" ? ArrowUpRight : ArrowDownLeft
                const TypeIcon = log.type === "video" ? Video : Phone
                const duration = formatDuration(log.durationSeconds)
                const isCallMenuOpen = openCallMenuId === log.id
                const canStartCall = callSocket.status === "idle"

                return (
                  <li key={log.id}>
                    <div className="relative flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-white">
                      <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e5f8e8] text-sm font-bold text-[#2f733c]">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          peerName.slice(0, 1).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-[#18251b]">{peerName}</p>
                          <TypeIcon className="size-3.5 shrink-0 text-[#65786a]" />
                        </div>
                        <div className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${getStatusClassName(log.status)}`}>
                          {["missed", "declined", "unavailable", "failed"].includes(log.status) ? (
                            <X className="size-3.5" />
                          ) : (
                            <DirectionIcon className="size-3.5" />
                          )}
                          <span className="truncate">{getStatusText(log)}</span>
                          {duration && <span className="text-[#7a8a7d]">· {duration}</span>}
                        </div>
                      </div>

                      <div className="shrink-0 text-right text-[11px] font-semibold text-[#7a8a7d]">
                        <p>{moment(log.startedAt).format("h:mm A")}</p>
                        <p className="mt-1">{moment(log.startedAt).calendar(null, { sameDay: "[Today]", lastDay: "[Yesterday]", lastWeek: "ddd", sameElse: "MMM D" })}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openConversation(log.peerId)}
                          disabled={isChatListLoading}
                          className="inline-flex size-8 items-center justify-center rounded-full text-[#35513a] transition hover:bg-[#e5f8e8] focus:outline-none focus:ring-2 focus:ring-[#96e6a1] disabled:cursor-wait disabled:opacity-40"
                          aria-label={`Open chat with ${peerName}`}
                          title="Open chat"
                        >
                          <MessageCircle className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenCallMenuId((currentId) => (currentId === log.id ? null : log.id))}
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
                            onClick={() => startCall(peer, log.peerId, "audio")}
                            className="inline-flex size-8 items-center justify-center rounded-full text-[#35513a] transition hover:bg-[#e5f8e8] focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
                            aria-label={`Start audio call with ${peerName}`}
                            title="Audio call"
                          >
                            <Phone className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startCall(peer, log.peerId, "video")}
                            className="inline-flex size-8 items-center justify-center rounded-full text-[#35513a] transition hover:bg-[#e5f8e8] focus:outline-none focus:ring-2 focus:ring-[#96e6a1]"
                            aria-label={`Start video call with ${peerName}`}
                            title="Video call"
                          >
                            <Video className="size-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#4f8f59] shadow-sm">
                <Clock size={24} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#18251b]">No calls yet</h3>
              <p className="mt-2 text-sm leading-6 text-[#65786a]">
                Start an audio or video call from a private chat and it will appear here.
              </p>
              <Link
                to={CHAT_PAGE}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#96e6a1] px-4 py-2 text-sm font-semibold text-[#102315] transition hover:bg-[#84dc91] focus:outline-none focus:ring-2 focus:ring-[#96e6a1] focus:ring-offset-2"
              >
                <Search size={16} />
                Find someone
              </Link>
            </div>
          </div>
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
}

export default ChatCalls
