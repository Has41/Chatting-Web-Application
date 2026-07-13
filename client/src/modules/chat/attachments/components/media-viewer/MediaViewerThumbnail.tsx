import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"
import PlayIcon from "./PlayIcon"

interface MediaViewerThumbnailProps {
  item: MediaViewerItem
  index: number
  active: boolean
  onSelect: (index: number) => void
}

const MediaViewerThumbnail = ({ item, index, active, onSelect }: MediaViewerThumbnailProps) => (
  <button
    type="button"
    onClick={() => onSelect(index)}
    className={`relative h-14 w-16 shrink-0 overflow-hidden rounded border transition ${
      active ? "border-white" : "border-white/15 opacity-70 hover:opacity-100"
    }`}
    aria-label={`Open media ${index + 1}`}
  >
    {item.mediaType === "image" ? (
      <img src={item.mediaUrl} alt="" className="h-full w-full object-cover" />
    ) : (
      <>
        <video src={item.mediaUrl} preload="metadata" muted className="h-full w-full object-cover">
          <track kind="captions" label="Captions unavailable" />
        </video>
        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
          <PlayIcon />
        </span>
      </>
    )}
  </button>
)

export default MediaViewerThumbnail
