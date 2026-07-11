import { Play } from "lucide-react"
import { useState } from "react"
import MediaViewerModal, { type MediaViewerItem } from "./MediaViewerModal"
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
  mediaGallery?: MediaViewerItem[]
  mediaGalleryIndex?: number
}

const FileMessagePreview = ({ fileMeta, isSender, mediaGallery = [], mediaGalleryIndex = 0 }: FileMessagePreviewProps) => {
  const { mediaUrl, caption, mediaType, mimeType, fileName } = fileMeta
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(mediaGalleryIndex)
  const fileType = resolveFilePreviewType({ mediaType, mimeType, fileName, mediaUrl })
  const displayName = fileName || mediaUrl?.split("?")[0]?.split("/").pop() || "Download file"
  const canOpenMediaViewer = !!mediaUrl && (fileType === "image" || fileType === "video")
  const viewerItems =
    mediaGallery.length > 0 && mediaGalleryIndex >= 0
      ? mediaGallery
      : canOpenMediaViewer
        ? [{ mediaUrl, mediaType: fileType, title: caption || displayName }]
        : []
  const openViewer = () => {
    setCurrentGalleryIndex(mediaGallery.length > 0 && mediaGalleryIndex >= 0 ? mediaGalleryIndex : 0)
    setIsViewerOpen(true)
  }

  return (
    <div className="flex min-w-0 flex-col">
      {fileType === "image" && mediaUrl && (
        <button
          type="button"
          onClick={openViewer}
          className="max-w-full overflow-hidden rounded text-left transition focus:ring-2 focus:ring-white/70 focus:outline-none"
          aria-label="Open image"
        >
          <img src={mediaUrl} alt={caption || "Image"} className="max-h-60 max-w-full object-contain" />
        </button>
      )}

      {fileType === "video" && mediaUrl && (
        <button
          type="button"
          onClick={openViewer}
          className="group relative w-full overflow-hidden rounded-md bg-black text-left transition focus:ring-2 focus:ring-white/70 focus:outline-none"
          aria-label="Open video"
        >
          <video src={mediaUrl} preload="metadata" muted className="max-h-60 w-full object-contain" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/20">
            <span className="flex size-12 items-center justify-center rounded-full bg-black/60 text-white shadow">
              <Play className="ml-0.5 size-6 fill-white" strokeWidth={2} />
            </span>
          </span>
        </button>
      )}

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

      {canOpenMediaViewer && isViewerOpen && (
        <MediaViewerModal
          items={viewerItems}
          currentIndex={currentGalleryIndex}
          onCurrentIndexChange={setCurrentGalleryIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  )
}

export default FileMessagePreview
