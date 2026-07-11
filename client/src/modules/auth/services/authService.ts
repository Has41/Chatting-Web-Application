import axiosInstance from "@shared/api/api-client"
import { AUTH_PATHS } from "@shared/constants/apiPaths"

export const verifyOtp = async (payload: { otp: string; email: string }) => {
  const { data } = await axiosInstance.post(AUTH_PATHS.VERIFY_OTP, payload)
  return data
}
