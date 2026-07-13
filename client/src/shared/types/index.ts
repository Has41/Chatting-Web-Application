// User Types
export interface User {
  _id: string
  username: string
  displayName?: string
  email: string
  phoneNumber?: string
  avatar?: string
  profilePicture?: { url?: string; public_id?: string }
  bio?: string
  dateOfBirth?: string
  gender?: "Male" | "Female" | "Prefer not to say"
  location?: string
  interests?: string[]
  isVerified?: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthUser extends User {
  accessToken?: string
}

// Message Types
export interface Message {
  _id: string
  conversationId: string
  channel?: string
  sender: string | User
  content?: string
  messageType?: string
  media?: {
    publicId?: string
    mediaUrl?: string
    fileName?: string
    thumbnailUrl?: string
    caption?: string
    mediaType?: string
    mimeType?: string
  }
  seenBy?: Array<{ user: User | string; seenAt?: string }>
  text?: string
  file?: FileAttachment
  attachments?: FileAttachment[]
  replyTo?: string
  reactions?: MessageReaction[]
  isDeleted?: boolean
  editedAt?: string
  createdAt: string
  updatedAt: string
}

export interface FileAttachment {
  url: string
  type: "image" | "video" | "audio" | "document" | "pdf"
  name: string
  size: number
  mimeType?: string
  thumbnail?: string
  duration?: number
}

export interface MessageReaction {
  emoji: string
  user?: string | User
  users?: string[]
}

// Conversation Types
export interface Conversation {
  _id: string
  type: "private" | "group"
  conversationType?: "private" | "group"
  name?: string
  groupName?: string
  groupInfo?: string
  groupPicture?: { url?: string }
  groupOwner?: any
  participants: (User | string)[]
  admins?: (User | string)[]
  lastMessage?: Message
  unreadCount?: number
  groupAvatar?: string
  isMuted?: boolean
  isPinned?: boolean
  createdAt: string
  updatedAt: string
}

export interface Story {
  _id: string
  owner: User
  media: {
    mediaUrl: string
    publicId?: string
    mediaType: "image" | "video"
    mimeType?: string
    caption?: string
  }
  createdAt: string
  expiresAt: string
}

export interface Channel {
  _id: string
  name: string
  description?: string
  avatar?: { url?: string; publicId?: string }
  visibility: "public" | "private"
  sendPermissions?: "admins" | "members"
  owner: User | string
  admins: (User | string)[]
  members: (User | string)[]
  messages?: string[]
  lastMessage?: Message
  mediaUrls?: string[]
  createdAt: string
  updatedAt: string
}

// Call Types
export interface Call {
  _id: string
  conversationId: string
  caller: string | User
  receiver: string | User
  type: "audio" | "video"
  status: "pending" | "accepted" | "rejected" | "ended"
  startedAt?: string
  endedAt?: string
  duration?: number
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword?: string
}

export interface OTPVerification {
  email: string
  otp: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form Types
export interface ProfileUpdateData {
  username?: string
  bio?: string
  dateOfBirth?: string
  gender?: "Male" | "Female" | "Prefer not to say"
  location?: string
  interests?: string[]
}

// Chat Context Types
export interface ChatState {
  activeConversation: Conversation | null
  conversations: Conversation[]
  messages: Record<string, Message[]>
  isLoading: boolean
  error: string | null
}

export interface ChatActions {
  setActiveConversation: (conversation: Conversation | null) => void
  fetchConversations: () => Promise<void>
  fetchMessages: (conversationId: string) => Promise<void>
  sendMessage: (conversationId: string, text: string, file?: FileAttachment) => Promise<void>
}

// Socket Event Types
export interface SocketEvents {
  "message:received": Message
  "message:updated": Message
  "message:deleted": string
  "conversation:updated": Conversation
  "user:online": string
  "user:offline": string
  "call:incoming": Call
  "call:accepted": Call
  "call:rejected": Call
  "call:ended": Call
}

// Theme Types
export interface ThemeSettings {
  mode: "light" | "dark" | "system"
  primaryColor: string
  fontSize: "small" | "medium" | "large"
  messageBubble: "rounded" | "square"
}

// Search Types
export interface SearchFilters {
  query: string
  type?: "users" | "messages" | "conversations"
  dateRange?: {
    start: string
    end: string
  }
}
