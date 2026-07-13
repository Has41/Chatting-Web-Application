import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { STORY_PATHS } from "@shared/constants/apiPaths"
import axiosInstance from "@shared/api/api-client"
import type { Story } from "@shared/types"

interface StoryViewerModalProps {
  stories: Story[]
  initialStoryId?: string
  currentUserId?: string
  onClose: () => void
}

const StoryViewerModal = ({ stories, initialStoryId, currentUserId, onClose }: StoryViewerModalProps) => {
  const queryClient = useQueryClient()
  const initialIndex = Math.max(
    0,
    stories.findIndex((story) => story._id === initialStoryId)
  )
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const currentStory = stories[currentIndex] ?? stories[0]
  const hasMultipleStories = stories.length > 1

  const ownerName = useMemo(() => {
    if (!currentStory) return "Story"
    return currentStory.owner.displayName || currentStory.owner.username
  }, [currentStory])

  const deleteStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const response = await axiosInstance.delete(`${STORY_PATHS.DELETE}/${storyId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] })
      onClose()
    }
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft" && hasMultipleStories) {
        setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1))
      }
      if (event.key === "ArrowRight" && hasMultipleStories) {
        setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1))
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [hasMultipleStories, onClose, stories.length])

  if (!currentStory) return null

  const goToPrevious = () => setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1))
  const goToNext = () => setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1))
  const isOwnStory = currentStory.owner._id === currentUserId

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 text-white backdrop-blur-sm">
      <div className="relative flex h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-zinc-950 shadow-2xl">
        <div className="absolute top-0 right-0 left-0 z-20 space-y-3 bg-linear-to-b from-black/70 to-transparent p-4">
          <div className="flex gap-1">
            {stories.map((story, index) => (
              <div key={story._id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
                <div className={`h-full rounded-full bg-white ${index <= currentIndex ? "w-full" : "w-0"}`} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {currentStory.owner.profilePicture?.url ? (
                <img src={currentStory.owner.profilePicture.url} alt="" className="size-9 rounded-full object-cover" />
              ) : (
                <div className="flex size-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
                  {ownerName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{ownerName}</p>
                <p className="text-xs text-white/60">Story</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isOwnStory && (
                <button
                  type="button"
                  onClick={() => deleteStoryMutation.mutate(currentStory._id)}
                  className="inline-flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Delete story"
                  title="Delete story"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
          {hasMultipleStories && (
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/45 transition hover:bg-black/70"
              aria-label="Previous story"
            >
              <ChevronLeft className="size-7" />
            </button>
          )}

          {currentStory.media.mediaType === "image" ? (
            <img src={currentStory.media.mediaUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            <video
              key={currentStory._id}
              src={currentStory.media.mediaUrl}
              className="max-h-full max-w-full"
              controls
              autoPlay
            />
          )}

          {hasMultipleStories && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/45 transition hover:bg-black/70"
              aria-label="Next story"
            >
              <ChevronRight className="size-7" />
            </button>
          )}
        </div>

        {currentStory.media.caption && (
          <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-4 pt-16">
            <p className="text-center text-sm font-medium">{currentStory.media.caption}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryViewerModal
