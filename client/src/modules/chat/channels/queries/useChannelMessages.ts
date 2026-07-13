import { useInfiniteQuery } from "@tanstack/react-query"
import { channelsApi, type ChannelMessagesPage } from "../api/channelsApi"
import { channelKeys } from "./useChannels"

export const useChannelMessages = (channelId?: string) =>
  useInfiniteQuery({
    queryKey: channelKeys.messages(channelId),
    queryFn: ({ pageParam = 1 }) => channelsApi.getChannelMessages(channelId!, Number(pageParam), 20),
    enabled: !!channelId,
    initialPageParam: 1,
    getNextPageParam: (lastPage: ChannelMessagesPage, pages: ChannelMessagesPage[]) =>
      lastPage.messages.length === 20 ? pages.length + 1 : undefined
  })
