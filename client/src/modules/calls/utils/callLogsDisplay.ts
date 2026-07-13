import { getChatConversationRoute, getNewChatRoute } from "@shared/constants/routePaths"
import { formatCalendarDay, formatTime } from "@shared/utils/dateTime"
import type { Conversation, User } from "@shared/types"
import type { CallLogEntry, CallLogStatus } from "@calls/types/callLogs"

export const getCallLogUserName = (user?: User) => user?.displayName || user?.username || "Member"

export const getCallLogAvatarUrl = (user?: User) => user?.profilePicture?.url || user?.avatar || ""

export const getCallLogStatusText = (log: CallLogEntry) => {
  if (log.status === "ended") return log.direction === "outgoing" ? "Outgoing call" : "Incoming call"
  if (log.status === "answered") return log.direction === "outgoing" ? "Calling..." : "Answered"
  if (log.status === "calling") return "Calling..."
  if (log.status === "missed") return "Missed call"
  if (log.status === "declined") return "Declined"
  if (log.status === "unavailable") return "Unavailable"
  return "Failed"
}

export const getCallLogStatusClassName = (status: CallLogStatus) => {
  if (["missed", "declined", "unavailable", "failed"].includes(status)) return "text-red-500"
  if (status === "calling" || status === "answered") return "text-[#2f733c]"
  return "text-[#65786a]"
}

export const formatCallDuration = (seconds?: number) => {
  if (!seconds) return ""
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (!minutes) return `${remainingSeconds}s`
  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`
}

export const formatCallStartedTime = (startedAt: string) => formatTime(startedAt, "upper")

export const formatCallStartedDay = (startedAt: string) => formatCalendarDay(startedAt)

const getParticipantId = (participant: User | string) => (typeof participant === "string" ? participant : participant._id)

export const getCallConversationRoute = (chatList: Conversation[], peerId: string) => {
  const existingConversation = chatList.find((conversation) => {
    const isPrivate = (conversation.conversationType || conversation.type) === "private"
    return isPrivate && conversation.participants?.some((participant) => getParticipantId(participant) === peerId)
  })

  return existingConversation ? getChatConversationRoute(existingConversation._id) : getNewChatRoute(peerId)
}
