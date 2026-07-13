import axiosInstance from "@shared/api/api-client"
import { AUTH_PATHS, USER_PATHS } from "@shared/constants/apiPaths"
import type { User } from "@shared/types"
import type { SaveProfilePicturePayload, SaveProfilePictureResponse } from "@auth/types/profileUpload"

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await axiosInstance.get(USER_PATHS.GET_INFO)
  return data
}

export const saveProfilePicture = async (payload: SaveProfilePicturePayload): Promise<SaveProfilePictureResponse> => {
  const { data } = await axiosInstance.post<SaveProfilePictureResponse>(AUTH_PATHS.SAVE_PROFILE_PIC, payload)
  return data
}

export const logout = async () => {
  const { data } = await axiosInstance.post(AUTH_PATHS.LOG_OUT)
  return data
}
