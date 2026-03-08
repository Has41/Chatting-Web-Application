import axiosInstance from "@shared/utils/axiosInstance"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"

export const getUserConversations = async () => {
  const response = await axiosInstance.get(CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER)
  return response.data
}
