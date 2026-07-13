import resolveFilePreviewType from "@shared/utils/resolveFilePreviewType"
import type {
  ConversationFilesResponse,
  ResolvedSharedFile,
  SharedFile,
  SharedFileFilter,
  SharedFileFilterCounts
} from "@chat/attachments/types/sharedFiles"

export const sharedFileFilters: Array<{ key: SharedFileFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
  { key: "file", label: "Files" }
]

export const getSharedFileName = (url: string) => {
  const rawName = url.split("?")[0]?.split("/").pop() || "Shared file"
  return decodeURIComponent(rawName.replace(/\.[^/.]+$/, "")) || "Shared file"
}

export const getSharedFileBadge = (fileType: string) => {
  if (fileType === "image") return "IMG"
  if (fileType === "video") return "VID"
  if (fileType === "audio") return "AUD"
  if (fileType === "pdf") return "PDF"
  if (["word", "excel", "powerpoint"].includes(fileType)) return "DOC"

  return "FILE"
}

export const normalizeConversationFiles = (data?: ConversationFilesResponse): SharedFile[] => {
  if (Array.isArray(data?.files)) {
    return data.files.map((file) => ({ _id: file._id, ...file.media, createdAt: file.createdAt }))
  }

  if (Array.isArray(data?.mediaUrls)) {
    return data.mediaUrls.map((mediaUrl) => ({ mediaUrl }))
  }

  return []
}

export const resolveSharedFiles = (files: SharedFile[]): ResolvedSharedFile[] => {
  return files.map((file) => {
    const mediaUrl = file.mediaUrl ?? ""
    const resolvedType = resolveFilePreviewType({
      mediaUrl,
      mediaType: file.mediaType,
      mimeType: file.mimeType,
      fileName: file.fileName
    })
    const title = file.caption?.trim() || file.fileName || getSharedFileName(mediaUrl)

    return {
      ...file,
      resolvedType,
      title
    }
  })
}

export const getSharedFileFilterCounts = (files: ResolvedSharedFile[]): SharedFileFilterCounts => ({
  all: files.length,
  image: files.filter((file) => file.resolvedType === "image").length,
  video: files.filter((file) => file.resolvedType === "video").length,
  file: files.filter((file) => !["image", "video"].includes(file.resolvedType)).length
})

export const filterSharedFiles = (files: ResolvedSharedFile[], activeFilter: SharedFileFilter) => {
  if (activeFilter === "all") return files
  if (activeFilter === "file") return files.filter((file) => !["image", "video"].includes(file.resolvedType))
  return files.filter((file) => file.resolvedType === activeFilter)
}
