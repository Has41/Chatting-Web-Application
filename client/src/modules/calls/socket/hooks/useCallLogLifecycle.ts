import { useCallback } from "react"
import { createCallLog, finishCallLog } from "@calls/api/callLogsApi"
import type { FinalCallStatus } from "@calls/types/callSocket"
import type { CallRefs } from "./useCallRefs"

export const useCallLogLifecycle = (userId: string | undefined, refs: CallRefs) => {
  const rememberCallLog = useCallback(
    (callLog: Awaited<ReturnType<typeof createCallLog>>) => {
      if (!callLog) return

      const pendingFinalStatus = refs.pendingFinalCallStatusRef.current
      refs.setActiveCallLog(callLog.id, callLog.startedAt)

      if (pendingFinalStatus) {
        refs.setPendingFinalCallStatus(null)
        finishCallLog(userId, callLog.id, pendingFinalStatus, callLog.startedAt)
      }
    },
    [refs, userId]
  )

  const finishActiveCallLog = useCallback(
    (status: FinalCallStatus) => {
      if (refs.finalizedCallStatusRef.current) return

      refs.setFinalizedCallStatus(status)

      if (refs.activeCallLogIdRef.current) {
        finishCallLog(userId, refs.activeCallLogIdRef.current, status, refs.activeCallStartedAtRef.current)
        return
      }

      refs.setPendingFinalCallStatus(status)
    },
    [refs, userId]
  )

  return {
    rememberCallLog,
    finishActiveCallLog
  }
}
