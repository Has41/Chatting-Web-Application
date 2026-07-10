import axios, { AxiosInstance } from "axios"

const apiBaseURL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/?$/, "")

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  withCredentials: true
})

export default axiosInstance
