import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"
import type { User } from "@shared/types"

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await axiosInstance.get(USER_PATHS.GET_INFO)
  return data
}
