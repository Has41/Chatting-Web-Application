import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import type { ChatSearchPayload, ChatSearchResponse } from "@chat/conversations/types/chatSearch"

export const searchUserConversationData = async ({ dataToSearch }: ChatSearchPayload): Promise<ChatSearchResponse> => {
  const response = await axiosInstance.get(USER_PATHS.SEARCH_USER_CONVO_DATA, {
    params: { dataToSearch }
  })

  return response.data
}
