import { useMutation, useQuery } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"

interface UseFetchConfig {
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: any
  queryOptions?: Record<string, any>
  options?: {
    mutationOptions?: Record<string, any>
  }
}

const useFetch = ({ endpoint, method = "GET", body = null, queryOptions, options }: UseFetchConfig) => {
  if (method === "GET") {
    return useQuery({
      queryKey: [endpoint],
      queryFn: async () => {
        const { data } = await axiosInstance.get(endpoint)
        return data
      },
      ...(queryOptions || {})
    })
  }

  return useMutation({
    mutationFn: async (payload?: any) => {
      const requestBody = payload ?? body
      const { data } = await axiosInstance.request({
        url: endpoint,
        method,
        data: requestBody
      })
      return data
    },
    ...(options?.mutationOptions || {})
  })
}

export default useFetch
