import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { channelsApi, type CreateChannelPayload, type UpdateChannelPayload } from "../api/channelsApi"

export const channelKeys = {
  all: ["channels"] as const,
  my: ["channels", "my"] as const,
  public: (query: string) => ["channels", "public", query] as const,
  detail: (channelId?: string) => ["channels", "detail", channelId] as const,
  messages: (channelId?: string) => ["channels", "messages", channelId] as const,
  files: (channelId?: string) => ["channels", "files", channelId] as const
}

export const useMyChannels = () =>
  useQuery({
    queryKey: channelKeys.my,
    queryFn: channelsApi.getMyChannels
  })

export const usePublicChannels = (query: string) =>
  useQuery({
    queryKey: channelKeys.public(query),
    queryFn: () => channelsApi.getPublicChannels(query)
  })

export const useChannel = (channelId?: string) =>
  useQuery({
    queryKey: channelKeys.detail(channelId),
    queryFn: () => channelsApi.getChannel(channelId!),
    enabled: !!channelId
  })

export const useChannelFiles = (channelId?: string) =>
  useQuery({
    queryKey: channelKeys.files(channelId),
    queryFn: () => channelsApi.getChannelFiles(channelId!),
    enabled: !!channelId
  })

export const useCreateChannel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateChannelPayload) => channelsApi.createChannel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: ["channels", "public"] })
    }
  })
}

export const useJoinChannel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (channelId: string) => channelsApi.joinChannel(channelId),
    onSuccess: (_data: { message: string }, channelId: string) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
      queryClient.invalidateQueries({ queryKey: ["channels", "public"] })
    }
  })
}

export const useLeaveChannel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (channelId: string) => channelsApi.leaveChannel(channelId),
    onSuccess: (_data: { message: string }, channelId: string) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
      queryClient.invalidateQueries({ queryKey: ["channels", "public"] })
    }
  })
}

export const useUpdateChannel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ channelId, payload }: { channelId: string; payload: UpdateChannelPayload }) =>
      channelsApi.updateChannel(channelId, payload),
    onSuccess: (_data: Awaited<ReturnType<typeof channelsApi.updateChannel>>, { channelId }: { channelId: string; payload: UpdateChannelPayload }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
      queryClient.invalidateQueries({ queryKey: ["channels", "public"] })
    }
  })
}

export const useDeleteChannel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (channelId: string) => channelsApi.deleteChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: ["channels", "public"] })
    }
  })
}

export const useAddChannelMembers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ channelId, members }: { channelId: string; members: string[] }) =>
      channelsApi.addChannelMembers(channelId, members),
    onSuccess: (_data: Awaited<ReturnType<typeof channelsApi.addChannelMembers>>, { channelId }: { channelId: string; members: string[] }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
    }
  })
}

export const useRemoveChannelMembers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ channelId, members }: { channelId: string; members: string[] }) =>
      channelsApi.removeChannelMembers(channelId, members),
    onSuccess: (_data: Awaited<ReturnType<typeof channelsApi.removeChannelMembers>>, { channelId }: { channelId: string; members: string[] }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
    }
  })
}

export const useTransferChannelOwnership = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ channelId, newOwnerId }: { channelId: string; newOwnerId: string }) =>
      channelsApi.transferChannelOwnership(channelId, newOwnerId),
    onSuccess: (_data: Awaited<ReturnType<typeof channelsApi.transferChannelOwnership>>, { channelId }: { channelId: string; newOwnerId: string }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.my })
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
    }
  })
}

export const usePromoteChannelAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ channelId, targetUserId }: { channelId: string; targetUserId: string }) =>
      channelsApi.promoteChannelAdmin(channelId, targetUserId),
    onSuccess: (_data: Awaited<ReturnType<typeof channelsApi.promoteChannelAdmin>>, { channelId }: { channelId: string; targetUserId: string }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
    }
  })
}

export const useDemoteChannelAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ channelId, targetUserId }: { channelId: string; targetUserId: string }) =>
      channelsApi.demoteChannelAdmin(channelId, targetUserId),
    onSuccess: (_data: Awaited<ReturnType<typeof channelsApi.demoteChannelAdmin>>, { channelId }: { channelId: string; targetUserId: string }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) })
    }
  })
}
