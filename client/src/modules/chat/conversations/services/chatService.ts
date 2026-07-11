import axiosInstance from "@shared/api/api-client"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"

export const getUserConversations = async () => {
  const { data } = await axiosInstance.get(CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER)
  return data
}
