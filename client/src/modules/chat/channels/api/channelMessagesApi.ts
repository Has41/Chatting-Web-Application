import axiosInstance from "@shared/api/api-client"
import { MESSAGE_PATHS } from "@shared/constants/apiPaths"
import type { EditChannelMessageVariables } from "../types/channelChat"

export const channelMessagesApi = {
  editMessage: async ({ messageId, content, field = "content" }: EditChannelMessageVariables) => {
    const response = await axiosInstance.patch(`${MESSAGE_PATHS.EDIT_MESSAGE}/${messageId}`, {
      [field === "caption" ? "caption" : "content"]: content
    })
    return response.data
  },

  deleteMessage: async (messageId: string) => {
    const response = await axiosInstance.delete(`${MESSAGE_PATHS.DELETE_MESSAGE}/${messageId}`)
    return response.data
  }
}
