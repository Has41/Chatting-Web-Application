import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import type { UserSearchResult } from "@chat/conversations/types/userSearch"

export const searchUsers = async (dataToSearch: string): Promise<UserSearchResult[]> => {
  const response = await axiosInstance.get<UserSearchResult[]>(USER_PATHS.SEARCH_FRIENDS_USERS, {
    params: { dataToSearch }
  })

  return response.data
}

export const sendFriendRequest = async (userId: string) => {
  const response = await axiosInstance.post(`${USER_PATHS.SEND_FRIEND_REQUEST}/${userId}`)
  return response.data
}
