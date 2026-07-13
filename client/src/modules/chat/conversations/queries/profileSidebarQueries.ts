import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editGroupInfo, runGroupManagementAction } from "@chat/conversations/api/groupManagementApi"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import type { EditGroupInfoPayload, GroupManagementVariables } from "@chat/conversations/types/profileSidebar"

export const useEditGroupInfoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editGroupInfo,
    onSuccess: (_data: unknown, variables: EditGroupInfoPayload) => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER] })
      queryClient.invalidateQueries({ queryKey: ["groupConversation", variables.conversationId] })
    }
  })
}

export const useGroupManagementMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: runGroupManagementAction,
    onSuccess: (_data: unknown, variables: GroupManagementVariables & { conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["groupConversation", variables.conversationId] })
    }
  })
}
