import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCallLogs, subscribeToCallLogs } from "@calls/api/callLogsApi"

export const callLogKeys = {
  all: ["callLogs"] as const,
  byUser: (userId?: string) => ["callLogs", userId] as const
}

export const useCallLogsQuery = (userId?: string) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: callLogKeys.byUser(userId),
    queryFn: getCallLogs,
    enabled: Boolean(userId)
  })

  useEffect(() => {
    return subscribeToCallLogs(userId, () => {
      queryClient.invalidateQueries({ queryKey: callLogKeys.byUser(userId) })
    })
  }, [queryClient, userId])

  return query
}
