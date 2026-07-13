import { ChevronLeft, ChevronRight } from "lucide-react"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"

interface MediaViewerStageProps {
  currentItem: MediaViewerItem
  hasMultipleItems: boolean
  onPrevious: () => void
  onNext: () => void
}

const MediaViewerStage = ({ currentItem, hasMultipleItems, onPrevious, onNext }: MediaViewerStageProps) => (
  <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black p-4">
    {hasMultipleItems && (
      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/80"
        title="Previous"
        aria-label="Previous"
      >
        <ChevronLeft className="size-7" strokeWidth={2} />
      </button>
    )}

    {currentItem.mediaType === "image" ? (
      <img src={currentItem.mediaUrl} alt={currentItem.title || "Image"} className="max-h-full max-w-full object-contain" />
    ) : (
      <video key={currentItem.mediaUrl} src={currentItem.mediaUrl} controls autoPlay className="max-h-full max-w-full rounded">
        <track kind="captions" label="Captions unavailable" />
      </video>
    )}

    {hasMultipleItems && (
      <button
        type="button"
        onClick={onNext}
        className="absolute right-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/80"
        title="Next"
        aria-label="Next"
      >
        <ChevronRight className="size-7" strokeWidth={2} />
      </button>
    )}
  </div>
)

export default MediaViewerStage
