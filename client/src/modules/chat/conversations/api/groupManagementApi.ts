import axiosInstance from "@shared/api/api-client"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import type { Conversation } from "@shared/types"
import type { EditGroupInfoPayload, GroupManagementVariables } from "@chat/conversations/types/profileSidebar"

export const editGroupInfo = async ({ conversationId, groupName, groupInfo }: EditGroupInfoPayload) => {
  const response = await axiosInstance.patch(`${CONVERSATION_PATHS.EDIT_GROUP_INFO}/${conversationId}`, {
    groupName,
    groupInfo
  })
  return response.data
}

export const groupManagementApi = {
  addParticipants: async (conversationId: string, participants: string[]) => {
    const response = await axiosInstance.post<{ group: Conversation; message: string }>(
      CONVERSATION_PATHS.ADD_GROUP_PARTICIPANTS(conversationId),
      { participants }
    )
    return response.data
  },

  removeParticipants: async (conversationId: string, participants: string[]) => {
    const response = await axiosInstance.delete<{ group: Conversation; message: string }>(
      CONVERSATION_PATHS.REMOVE_GROUP_PARTICIPANTS(conversationId),
      { data: { participants } }
    )
    return response.data
  },

  transferOwnership: async (conversationId: string, newOwnerId: string) => {
    const response = await axiosInstance.patch<{
      groupOwner: string
      participants: string[]
      admins: string[]
      message: string
    }>(CONVERSATION_PATHS.TRANSFER_GROUP_OWNERSHIP(conversationId, newOwnerId))
    return response.data
  },

  promoteAdmin: async (conversationId: string, targetUserId: string) => {
    const response = await axiosInstance.patch<{ group: Conversation; message: string }>(
      CONVERSATION_PATHS.PROMOTE_GROUP_ADMIN(conversationId, targetUserId)
    )
    return response.data
  },

  demoteAdmin: async (conversationId: string, targetUserId: string) => {
    const response = await axiosInstance.patch<{ group: Conversation; message: string }>(
      CONVERSATION_PATHS.DEMOTE_GROUP_ADMIN(conversationId, targetUserId)
    )
    return response.data
  }
}

export const runGroupManagementAction = ({ conversationId, action, target }: GroupManagementVariables & { conversationId: string }) => {
  if (action === "remove") return groupManagementApi.removeParticipants(conversationId, [target._id])
  if (action === "transfer") return groupManagementApi.transferOwnership(conversationId, target._id)
  if (action === "promote") return groupManagementApi.promoteAdmin(conversationId, target._id)
  return groupManagementApi.demoteAdmin(conversationId, target._id)
}
