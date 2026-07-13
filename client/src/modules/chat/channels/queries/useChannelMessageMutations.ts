import { useMutation, useQueryClient } from "@tanstack/react-query"
import { channelMessagesApi } from "../api/channelMessagesApi"
import type { EditChannelMessageVariables } from "../types/channelChat"
import { channelKeys } from "./useChannels"

export const useEditChannelMessageMutation = (channelId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: EditChannelMessageVariables) => channelMessagesApi.editMessage(payload),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.messages(channelId) })
    },
    onError: (error: unknown) => {
      console.error("Error editing channel message:", error)
    }
  })
}

export const useDeleteChannelMessageMutation = (channelId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (messageId: string) => channelMessagesApi.deleteMessage(messageId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.messages(channelId) })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
    },
    onError: (error: unknown) => {
      console.error("Error deleting channel message:", error)
    }
  })
}
