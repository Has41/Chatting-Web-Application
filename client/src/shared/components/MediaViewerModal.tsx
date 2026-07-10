import { ChevronLeft, ChevronRight, Download, ExternalLink, X } from "lucide-react"
import { useEffect } from "react"

export interface MediaViewerItem {
  mediaUrl: string
  mediaType: "image" | "video"
  title?: string
}

interface MediaViewerModalProps {
  items: MediaViewerItem[]
  currentIndex: number
  onCurrentIndexChange: (index: number) => void
  onClose: () => void
}

const MediaViewerModal = ({ items, currentIndex, onCurrentIndexChange, onClose }: MediaViewerModalProps) => {
  const currentItem = items[currentIndex] ?? items[0]
  const hasMultipleItems = items.length > 1

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft" && hasMultipleItems) {
        onCurrentIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1)
      }
      if (event.key === "ArrowRight" && hasMultipleItems) {
        onCurrentIndexChange(currentIndex === items.length - 1 ? 0 : currentIndex + 1)
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentIndex, hasMultipleItems, items.length, onClose, onCurrentIndexChange])

  if (!currentItem) return null

  const goToPrevious = () => {
    onCurrentIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    onCurrentIndexChange(currentIndex === items.length - 1 ? 0 : currentIndex + 1)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 text-white backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={currentItem.title || "Media viewer"}
      onClick={onClose}
    >
      <div
        className="relative flex h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-zinc-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{currentItem.title || "Media"}</p>
            {hasMultipleItems && (
              <p className="text-xs text-white/50">
                {currentIndex + 1} of {items.length}
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

        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black p-4">
          {hasMultipleItems && (
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/80"
              title="Previous"
              aria-label="Previous"
            >
              <ChevronLeft className="size-7" strokeWidth={2} />
            </button>
          )}

          {currentItem.mediaType === "image" ? (
            <img
              src={currentItem.mediaUrl}
              alt={currentItem.title || "Image"}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <video key={currentItem.mediaUrl} src={currentItem.mediaUrl} controls autoPlay className="max-h-full max-w-full rounded" />
          )}

          {hasMultipleItems && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/80"
              title="Next"
              aria-label="Next"
            >
              <ChevronRight className="size-7" strokeWidth={2} />
            </button>
          )}
        </div>

        {hasMultipleItems && (
          <div className="flex h-20 shrink-0 items-center gap-2 overflow-x-auto border-t border-white/10 bg-zinc-950 px-4">
            {items.map((item, index) => (
              <button
                key={`${item.mediaUrl}-${index}`}
                type="button"
                onClick={() => onCurrentIndexChange(index)}
                className={`relative h-14 w-16 shrink-0 overflow-hidden rounded border transition ${
                  index === currentIndex ? "border-white" : "border-white/15 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Open media ${index + 1}`}
              >
                {item.mediaType === "image" ? (
                  <img src={item.mediaUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <video src={item.mediaUrl} preload="metadata" muted className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <PlayIcon />
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const PlayIcon = () => (
  <span className="flex size-6 items-center justify-center rounded-full bg-black/60">
    <svg viewBox="0 0 24 24" className="ml-0.5 size-3 fill-white" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  </span>
)

export default MediaViewerModal
