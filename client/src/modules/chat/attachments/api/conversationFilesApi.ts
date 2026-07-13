import axiosInstance from "@shared/api/api-client"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import type { ConversationFilesResponse } from "@chat/attachments/types/sharedFiles"

export const getConversationFiles = async (conversationId: string): Promise<ConversationFilesResponse> => {
  const response = await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_MEDIA}/${conversationId}`)
  return response.data
}
