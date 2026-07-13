import axiosInstance from "@shared/api/api-client"
import { CONVERSATION_PATHS, USER_PATHS } from "@shared/constants/apiPaths"
import type { CreateGroupPayload, GroupModalData } from "@chat/conversations/types/groupModal"

export const getGroupModalData = async (): Promise<GroupModalData> => {
  const response = await axiosInstance.get(USER_PATHS.GET_FRIENDS_AND_CONVERSATIONS)
  return response.data
}

export const createGroupConversation = async ({ participants }: CreateGroupPayload) => {
  const response = await axiosInstance.post(CONVERSATION_PATHS.CREATE_GROUP, { participants })
  return response.data
}
