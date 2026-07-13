import type { User } from "@shared/types"

export interface UserSearchResult extends User {
  isFriend?: boolean
  isRequestSent?: boolean
  hasIncomingRequest?: boolean
}
