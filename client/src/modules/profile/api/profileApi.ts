import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import type { AddInterestPayload, RemoveInterestPayload, UpdateProfilePayload } from "@profile/types/profile"

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await axiosInstance.patch(USER_PATHS.EDIT_PROFILE, payload)
  return data
}

export const addInterest = async (payload: AddInterestPayload) => {
  const { data } = await axiosInstance.post(USER_PATHS.ADD_INTEREST, payload)
  return data
}

export const removeInterest = async (payload: RemoveInterestPayload) => {
  const { data } = await axiosInstance.delete(USER_PATHS.REMOVE_INTEREST, { data: payload })
  return data
}
