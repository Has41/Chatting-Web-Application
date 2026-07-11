import axiosInstance from "@shared/api/api-client"
import { USER_PATHS } from "@shared/constants/apiPaths"

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get(USER_PATHS.GET_INFO)
  return data
}
