import type { Message } from "@shared/types"

export type ChannelMessage = Message & {
  channel?: string
  clientTempId?: string
  localStatus?: "sending" | "failed"
}

export interface ChannelMessagesCache {
  pages: Array<{ messages: ChannelMessage[] }>
}

export type EditChannelMessageVariables = {
  messageId: string
  content: string
  field?: "content" | "caption"
}
