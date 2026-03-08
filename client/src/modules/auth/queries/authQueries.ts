import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@auth/api/authApi"
import { USER_PATHS } from "@shared/constants/apiPaths"

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: [USER_PATHS.GET_INFO],
    queryFn: getCurrentUser,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 24 * 60 * 60 * 1000
  })
}
