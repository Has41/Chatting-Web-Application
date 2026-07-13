import type { SearchConversation, SearchFriend } from "@chat/navigation/types/search"

export interface ChatSearchPayload {
  dataToSearch: string
}

export interface ChatSearchResponse {
  conversation?: SearchConversation[]
  friendsData?: SearchFriend[]
}
