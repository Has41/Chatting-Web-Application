import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addInterest, removeInterest, updateProfile } from "@profile/api/profileApi"
import { USER_PATHS } from "@shared/constants/apiPaths"

const useInvalidateCurrentUser = () => {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: [USER_PATHS.GET_INFO] })
  }
}

export const useUpdateProfileMutation = () => {
  const invalidateCurrentUser = useInvalidateCurrentUser()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: invalidateCurrentUser,
    onError: (error: unknown) => {
      console.error(error)
    }
  })
}

export const useAddInterestMutation = () => {
  const invalidateCurrentUser = useInvalidateCurrentUser()

  return useMutation({
    mutationFn: addInterest,
    onSuccess: invalidateCurrentUser,
    onError: (error: unknown) => {
      console.error(error)
    }
  })
}

export const useRemoveInterestMutation = () => {
  const invalidateCurrentUser = useInvalidateCurrentUser()

  return useMutation({
    mutationFn: removeInterest,
    onSuccess: invalidateCurrentUser,
    onError: (error: unknown) => {
      console.error(error)
    }
  })
}
