import { useInfiniteQuery } from "@tanstack/react-query"
import { channelsApi } from "../api/channelsApi"
import { channelKeys } from "./useChannels"

export const useChannelMessages = (channelId?: string) =>
  useInfiniteQuery({
    queryKey: channelKeys.messages(channelId),
    queryFn: ({ pageParam = 1 }) => channelsApi.getChannelMessages(channelId!, pageParam, 20),
    enabled: !!channelId,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (lastPage.messages.length === 20 ? pages.length + 1 : undefined)
  })
