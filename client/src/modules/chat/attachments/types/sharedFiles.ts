import type { ResolvedFilePreviewType } from "@shared/utils/resolveFilePreviewType"

export type SharedFileFilter = "all" | "image" | "video" | "file"

export interface SharedFile {
  _id?: string
  mediaUrl?: string
  thumbnailUrl?: string
  caption?: string
  mediaType?: string
  mimeType?: string
  fileName?: string
  createdAt?: string
}

export interface ConversationFilesResponse {
  files?: Array<{
    _id?: string
    media?: Omit<SharedFile, "_id" | "createdAt">
    createdAt?: string
  }>
  mediaUrls?: string[]
}

export interface ResolvedSharedFile extends SharedFile {
  resolvedType: ResolvedFilePreviewType
  title: string
}

export type SharedFileFilterCounts = Record<SharedFileFilter, number>
