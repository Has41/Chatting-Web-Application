import { useQuery } from "@tanstack/react-query"
import { STORY_PATHS } from "@shared/constants/apiPaths"
import axiosInstance from "@shared/api/api-client"
import type { Story } from "@shared/types"

const useStories = (enabled = true) => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const response = await axiosInstance.get<Story[]>(STORY_PATHS.GET_ACTIVE)
      return response.data
    },
    enabled
  })
}

export default useStories
