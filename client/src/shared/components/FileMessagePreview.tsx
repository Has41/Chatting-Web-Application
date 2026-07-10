import PDFMeta from "./PDFMeta"
import resolveFilePreviewType from "@shared/utils/resolveFilePreviewType"

interface FileMeta {
  mediaUrl?: string
  caption?: string
  thumbnailUrl?: string
  mediaType?: string
  mimeType?: string
  fileName?: string
}

interface FileMessagePreviewProps {
  fileMeta: FileMeta
  isSender: boolean
}

const FileMessagePreview = ({ fileMeta, isSender }: FileMessagePreviewProps) => {
  const { mediaUrl, caption, mediaType, mimeType, fileName } = fileMeta
  const fileType = resolveFilePreviewType({ mediaType, mimeType, fileName, mediaUrl })
  const displayName = fileName || mediaUrl?.split("?")[0]?.split("/").pop() || "Download file"

  return (
    <div className="flex min-w-0 flex-col">
      {fileType === "image" && mediaUrl && (
        <img src={mediaUrl} alt={caption || "Image"} className="max-h-60 max-w-full rounded object-contain" />
      )}

      {fileType === "video" && mediaUrl && <video src={mediaUrl} controls className="max-h-60 w-full rounded-md" />}

      {fileType === "audio" && mediaUrl && <audio src={mediaUrl} controls className="w-full min-w-64 max-w-full" />}

      {fileType === "pdf" && mediaUrl && (
        <div className="space-y-2">
          {fileMeta.thumbnailUrl ? (
            <img src={fileMeta.thumbnailUrl} alt="PDF thumbnail" className="h-48 w-full rounded border object-cover shadow" />
          ) : null}
          <PDFMeta mediaUrl={mediaUrl ?? ""} fileName={fileName} />
        </div>
      )}

      {["word", "excel", "powerpoint", "archive", "text", "code", "other"].includes(fileType) ? (
        <div className="flex min-w-64 items-center gap-3 rounded-md bg-black/5 p-3">
          <img src="/file-icon.svg" alt="" className="size-10 shrink-0" />
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`min-w-0 truncate text-sm font-medium underline ${isSender ? "text-white" : "text-slate-800"}`}
          >
            {displayName}
          </a>
        </div>
      ) : null}

      {caption && <p className={`ml-2 text-sm ${isSender ? "text-white" : "text-black/80"} py-2`}>{caption}</p>}
    </div>
  )
}

export default FileMessagePreview
