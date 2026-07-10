import getFileType from "./getFileType"

export type ResolvedFilePreviewType =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "word"
  | "excel"
  | "powerpoint"
  | "archive"
  | "text"
  | "code"
  | "other"

interface ResolveFilePreviewTypeInput {
  mediaType?: string
  mimeType?: string
  fileName?: string
  mediaUrl?: string
}

const mimeTypeToPreviewType = (mimeType?: string): ResolvedFilePreviewType | null => {
  if (!mimeType) return null

  const mime = mimeType.toLowerCase()

  if (mime.startsWith("image/")) return "image"
  if (mime.startsWith("video/")) return "video"
  if (mime.startsWith("audio/")) return "audio"
  if (mime === "application/pdf") return "pdf"
  if (mime.includes("wordprocessingml") || mime === "application/msword") return "word"
  if (mime.includes("spreadsheetml") || mime === "application/vnd.ms-excel") return "excel"
  if (mime.includes("presentationml") || mime === "application/vnd.ms-powerpoint") return "powerpoint"
  if (mime.startsWith("text/")) return "text"
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar") || mime.includes("gzip")) return "archive"

  return null
}

const mediaTypeToPreviewType = (mediaType?: string): ResolvedFilePreviewType | null => {
  if (!mediaType) return null

  const normalized = mediaType.toLowerCase()
  if (normalized === "image" || normalized === "video" || normalized === "audio") return normalized
  if (normalized === "pdf") return "pdf"

  return null
}

const typeFromPath = (path?: string): ResolvedFilePreviewType | null => {
  if (!path) return null

  const fileType = getFileType(path)
  return fileType === "other" ? null : fileType
}

const resolveFilePreviewType = ({
  mediaType,
  mimeType,
  fileName,
  mediaUrl
}: ResolveFilePreviewTypeInput): ResolvedFilePreviewType => {
  return (
    mimeTypeToPreviewType(mimeType) ||
    typeFromPath(fileName) ||
    typeFromPath(mediaUrl) ||
    mediaTypeToPreviewType(mediaType) ||
    "other"
  )
}

export default resolveFilePreviewType
