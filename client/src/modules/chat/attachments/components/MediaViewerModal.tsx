import { useMediaViewerNavigation } from "@chat/attachments/hooks/useMediaViewerNavigation"
import MediaViewerHeader from "./media-viewer/MediaViewerHeader"
import MediaViewerStage from "./media-viewer/MediaViewerStage"
import MediaViewerThumbnailStrip from "./media-viewer/MediaViewerThumbnailStrip"

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
  const { dialogRef, currentItem, hasMultipleItems, goToPrevious, goToNext } = useMediaViewerNavigation({
    items,
    currentIndex,
    onCurrentIndexChange
  })

  if (!currentItem) return null

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-5xl bg-transparent p-4 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      aria-label={currentItem.title || "Media viewer"}
      onClose={onClose}
    >
      <div className="relative flex h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-zinc-950 shadow-2xl">
        <MediaViewerHeader
          currentItem={currentItem}
          currentIndex={currentIndex}
          itemCount={items.length}
          hasMultipleItems={hasMultipleItems}
          onClose={onClose}
        />

        <MediaViewerStage
          currentItem={currentItem}
          hasMultipleItems={hasMultipleItems}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />

        {hasMultipleItems && (
          <MediaViewerThumbnailStrip items={items} currentIndex={currentIndex} onCurrentIndexChange={onCurrentIndexChange} />
        )}
      </div>
    </dialog>
  )
}

export default MediaViewerModal
