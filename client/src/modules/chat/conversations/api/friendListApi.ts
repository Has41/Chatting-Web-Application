import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import type {
  FriendConversationsResponse,
  FriendsAndRequestsResponse,
  RespondFriendRequestPayload
} from "@chat/conversations/types/friendList"

export const getFriendsAndRequests = async (): Promise<FriendsAndRequestsResponse> => {
  const response = await axiosInstance.get(USER_PATHS.GET_FRIENDS_AND_REQUESTS)
  return response.data
}

export const getFriendsAndConversations = async (): Promise<FriendConversationsResponse> => {
  const response = await axiosInstance.get(USER_PATHS.GET_FRIENDS_AND_CONVERSATIONS)
  return response.data
}

export const respondToFriendRequest = async ({ userId, response }: RespondFriendRequestPayload) => {
  const result = await axiosInstance.post(`${USER_PATHS.RESPOND_FRIEND_REQUEST}/${userId}`, {
    response
  })
  return result.data
}
