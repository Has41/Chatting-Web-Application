import { useCallback } from "react"
import { createCallLog, finishCallLog } from "@calls/api/callLogsApi"
import type { FinalCallStatus } from "@calls/types/callSocket"
import type { CallRefs } from "./useCallRefs"

export const useCallLogLifecycle = (userId: string | undefined, refs: CallRefs) => {
  const rememberCallLog = useCallback(
    (callLog: Awaited<ReturnType<typeof createCallLog>>) => {
      if (!callLog) return

      const pendingFinalStatus = refs.pendingFinalCallStatusRef.current
      refs.activeCallLogIdRef.current = callLog.id
      refs.activeCallStartedAtRef.current = callLog.startedAt

      if (pendingFinalStatus) {
        refs.pendingFinalCallStatusRef.current = null
        finishCallLog(userId, callLog.id, pendingFinalStatus, callLog.startedAt)
      }
    },
    [refs, userId]
  )

  const finishActiveCallLog = useCallback(
    (status: FinalCallStatus) => {
      if (refs.finalizedCallStatusRef.current) return

      refs.finalizedCallStatusRef.current = status

      if (refs.activeCallLogIdRef.current) {
        finishCallLog(userId, refs.activeCallLogIdRef.current, status, refs.activeCallStartedAtRef.current)
        return
      }

      refs.pendingFinalCallStatusRef.current = status
    },
    [refs, userId]
  )

  return {
    rememberCallLog,
    finishActiveCallLog
  }
}
