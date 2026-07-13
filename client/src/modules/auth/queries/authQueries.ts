import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCurrentUser, logout, saveProfilePicture } from "@auth/api/authApi"
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

export const useSaveProfilePictureMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_PATHS.GET_INFO] })
    }
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
    }
  })
}
