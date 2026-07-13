import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import MediaViewerThumbnail from "./MediaViewerThumbnail"

interface MediaViewerThumbnailStripProps {
  items: MediaViewerItem[]
  currentIndex: number
  onCurrentIndexChange: (index: number) => void
}

const MediaViewerThumbnailStrip = ({ items, currentIndex, onCurrentIndexChange }: MediaViewerThumbnailStripProps) => (
  <div className="flex h-20 shrink-0 items-center gap-2 overflow-x-auto border-t border-white/10 bg-zinc-950 px-4">
    {items.map((item, index) => (
      <MediaViewerThumbnail
        key={item.mediaUrl}
        item={item}
        index={index}
        active={index === currentIndex}
        onSelect={onCurrentIndexChange}
      />
    ))}
  </div>
)

export default MediaViewerThumbnailStrip
