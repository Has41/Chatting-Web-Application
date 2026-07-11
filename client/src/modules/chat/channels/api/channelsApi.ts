import axiosInstance from "@shared/api/api-client"
import { CHANNEL_PATHS } from "@shared/constants/apiPaths"
import type { Channel, Message } from "@shared/types"

export interface CreateChannelPayload {
  name: string
  description?: string
  visibility?: "public" | "private"
  sendPermissions?: "admins" | "members"
  members?: string[]
}

export interface UpdateChannelPayload {
  name?: string
  description?: string
  visibility?: "public" | "private"
  sendPermissions?: "admins" | "members"
}

export interface CreateChannelMessagePayload {
  content?: string
  messageType: "text" | "file"
  fileData?: any
  clientTempId?: string
}

export const channelsApi = {
  createChannel: async (payload: CreateChannelPayload) => {
    const response = await axiosInstance.post<{ channel: Channel; message: string }>(CHANNEL_PATHS.BASE, payload)
    return response.data
  },

  getMyChannels: async () => {
    const response = await axiosInstance.get<{ channels: Channel[] }>(CHANNEL_PATHS.MY)
    return response.data.channels
  },

  getPublicChannels: async (query = "") => {
    const response = await axiosInstance.get<{ channels: Channel[] }>(CHANNEL_PATHS.PUBLIC, {
      params: query ? { q: query } : undefined
    })
    return response.data.channels
  },

  getChannel: async (channelId: string) => {
    const response = await axiosInstance.get<{ channel: Channel }>(CHANNEL_PATHS.DETAIL(channelId))
    return response.data.channel
  },

  joinChannel: async (channelId: string) => {
    const response = await axiosInstance.post<{ message: string }>(CHANNEL_PATHS.JOIN(channelId))
    return response.data
  },

  leaveChannel: async (channelId: string) => {
    const response = await axiosInstance.post<{ message: string }>(CHANNEL_PATHS.LEAVE(channelId))
    return response.data
  },

  updateChannel: async (channelId: string, payload: UpdateChannelPayload) => {
    const response = await axiosInstance.patch<{ channel: Channel; message: string }>(
      CHANNEL_PATHS.DETAIL(channelId),
      payload
    )
    return response.data
  },

  deleteChannel: async (channelId: string) => {
    const response = await axiosInstance.delete<{ message: string }>(CHANNEL_PATHS.DETAIL(channelId))
    return response.data
  },

  addChannelMembers: async (channelId: string, members: string[]) => {
    const response = await axiosInstance.post<{ channel: Channel; message: string }>(CHANNEL_PATHS.MEMBERS(channelId), {
      members
    })
    return response.data
  },

  removeChannelMembers: async (channelId: string, members: string[]) => {
    const response = await axiosInstance.delete<{ channel: Channel; message: string }>(CHANNEL_PATHS.MEMBERS(channelId), {
      data: { members }
    })
    return response.data
  },

  transferChannelOwnership: async (channelId: string, newOwnerId: string) => {
    const response = await axiosInstance.patch<{ channel: Channel; message: string }>(
      CHANNEL_PATHS.TRANSFER_OWNERSHIP(channelId, newOwnerId)
    )
    return response.data
  },

  promoteChannelAdmin: async (channelId: string, targetUserId: string) => {
    const response = await axiosInstance.patch<{ channel: Channel; message: string }>(
      CHANNEL_PATHS.PROMOTE_ADMIN(channelId, targetUserId)
    )
    return response.data
  },

  demoteChannelAdmin: async (channelId: string, targetUserId: string) => {
    const response = await axiosInstance.patch<{ channel: Channel; message: string }>(
      CHANNEL_PATHS.DEMOTE_ADMIN(channelId, targetUserId)
    )
    return response.data
  },

  getChannelMessages: async (channelId: string, page = 1, limit = 20) => {
    const response = await axiosInstance.get<{ messages: Message[] }>(CHANNEL_PATHS.MESSAGES(channelId), {
      params: { page, limit }
    })
    return response.data
  },

  getChannelFiles: async (channelId: string) => {
    const response = await axiosInstance.get<{
      files: Array<{ _id: string; media: Message["media"]; createdAt: string; sender: string | { _id: string } }>
    }>(CHANNEL_PATHS.FILES(channelId))
    return response.data
  },

  createChannelMessage: async (channelId: string, payload: CreateChannelMessagePayload) => {
    const response = await axiosInstance.post<{ message: Message }>(CHANNEL_PATHS.MESSAGES(channelId), payload)
    return response.data.message
  }
}
