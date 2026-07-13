import { Download, ExternalLink, X } from "lucide-react"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"

interface MediaViewerHeaderProps {
  currentItem: MediaViewerItem
  currentIndex: number
  itemCount: number
  hasMultipleItems: boolean
  onClose: () => void
}

const MediaViewerHeader = ({ currentItem, currentIndex, itemCount, hasMultipleItems, onClose }: MediaViewerHeaderProps) => (
  <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">{currentItem.title || "Media"}</p>
      {hasMultipleItems && (
        <p className="text-xs text-white/50">
          {currentIndex + 1} of {itemCount}
        </p>
      )}
    </div>
    <div className="flex items-center gap-1">
      <a
        href={currentItem.mediaUrl}
        download
        className="inline-flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
        title="Download"
        aria-label="Download"
      >
        <Download className="size-5" strokeWidth={2} />
      </a>
      <a
        href={currentItem.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
        title="Open in new tab"
        aria-label="Open in new tab"
      >
        <ExternalLink className="size-5" strokeWidth={2} />
      </a>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
        title="Close"
        aria-label="Close"
      >
        <X className="size-6" strokeWidth={2} />
      </button>
    </div>
  </div>
)

export default MediaViewerHeader
