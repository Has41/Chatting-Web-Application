import axiosInstance from "@shared/api/api-client"
import { CALL_PATHS } from "@shared/constants/apiPaths"
import type { CallLogDirection, CallLogEntry, CallLogStatus, CallLogType } from "@calls/types/callLogs"

const CALL_LOG_EVENT = "chat:call-logs-updated"

const emitCallLogEvent = (userId?: string) => {
  if (typeof window === "undefined") return

  window.dispatchEvent(new CustomEvent(CALL_LOG_EVENT, { detail: { userId } }))
}

export const getCallLogs = async () => {
  const response = await axiosInstance.get<{ callLogs: CallLogEntry[] }>(CALL_PATHS.BASE)
  return response.data.callLogs
}

export const subscribeToCallLogs = (userId: string | undefined, callback: () => void) => {
  if (!userId || typeof window === "undefined") return () => {}

  const handleCallLogEvent = (event: Event) => {
    const detail = (event as CustomEvent<{ userId?: string }>).detail
    if (!detail?.userId || detail.userId === userId) callback()
  }

  window.addEventListener(CALL_LOG_EVENT, handleCallLogEvent)

  return () => {
    window.removeEventListener(CALL_LOG_EVENT, handleCallLogEvent)
  }
}

export const createCallLog = async ({
  ownerId,
  peerId,
  direction,
  type,
  status = "calling"
}: {
  ownerId: string
  peerId: string
  direction: CallLogDirection
  type: CallLogType
  status?: CallLogStatus
}) => {
  try {
    const response = await axiosInstance.post<{ callLog: CallLogEntry }>(CALL_PATHS.BASE, {
      peerId,
      direction,
      type,
      status,
      startedAt: new Date().toISOString()
    })
    emitCallLogEvent(ownerId)
    return response.data.callLog
  } catch (error) {
    console.error("Unable to create call log:", error)
    return null
  }
}

export const updateCallLog = async (
  ownerId: string | undefined,
  logId: string | null | undefined,
  update: Partial<Pick<CallLogEntry, "status" | "endedAt" | "durationSeconds">>
) => {
  if (!ownerId || !logId) return

  try {
    await axiosInstance.patch(CALL_PATHS.DETAIL(logId), update)
    emitCallLogEvent(ownerId)
  } catch (error) {
    console.error("Unable to update call log:", error)
  }
}

export const finishCallLog = async (
  ownerId: string | undefined,
  logId: string | null | undefined,
  status: Exclude<CallLogStatus, "calling" | "answered">,
  startedAt?: string | null
) => {
  const endedAt = new Date().toISOString()
  const startedTime = startedAt ? new Date(startedAt).getTime() : NaN
  const endedTime = new Date(endedAt).getTime()
  const durationSeconds = Number.isFinite(startedTime) ? Math.max(0, Math.round((endedTime - startedTime) / 1000)) : 0

  await updateCallLog(ownerId, logId, { status, endedAt, durationSeconds })
}
