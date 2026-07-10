import { useMemo, useState } from "react"
import { Plus, UserRound } from "lucide-react"
import useAuth from "@auth/hooks/useAuth"
import type { Story, User } from "@shared/types"
import StoryUploadModal from "./StoryUploadModal"
import StoryViewerModal from "./StoryViewerModal"

interface StoryTrayProps {
  stories: Story[]
  friends: User[]
  onlineUserIds: Set<string>
}

const StoryTray = ({ stories, friends, onlineUserIds }: StoryTrayProps) => {
  const { user } = useAuth()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [viewerStoryId, setViewerStoryId] = useState<string | null>(null)

  const ownStories = useMemo(() => stories.filter((story) => story.owner._id === user?._id), [stories, user?._id])
  const friendStories = useMemo(() => stories.filter((story) => story.owner._id !== user?._id), [stories, user?._id])

  const firstStoryByOwner = useMemo(() => {
    const map = new Map<string, Story>()
    friendStories.forEach((story) => {
      if (!map.has(story.owner._id)) map.set(story.owner._id, story)
    })
    return Array.from(map.values())
  }, [friendStories])

  const handleOwnStoryClick = () => {
    if (ownStories.length > 0) {
      setViewerStoryId(ownStories[0]._id)
      return
    }

    setShowUploadModal(true)
  }

  return (
    <div className="my-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-black/80">Stories</h3>
        {stories.length > 0 && <span className="text-xs text-gray-500">{stories.length} active</span>}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={handleOwnStoryClick}
          className="flex w-20 shrink-0 flex-col items-center rounded-lg px-1 py-2 text-center transition hover:bg-gray-100"
          title={ownStories.length > 0 ? "View your story" : "Add story"}
        >
          <div className="relative mb-2 rounded-full bg-gradient-to-br from-slate-200 via-white to-slate-300 p-[2px]">
            {user?.profilePicture?.url ? (
              <img src={user.profilePicture.url} alt="" className="size-14 rounded-full object-cover" />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <UserRound className="size-6" />
              </div>
            )}
            <span className="absolute right-0 bottom-0 flex size-5 items-center justify-center rounded-full border-2 border-gray-50 bg-blue-600 text-white">
              <Plus className="size-3" />
            </span>
          </div>
          <p className="max-w-full truncate text-xs font-semibold text-black/80">Your story</p>
        </button>

        {firstStoryByOwner.length > 0 ? (
          firstStoryByOwner.map((story) => {
            const ownerName = story.owner.displayName || story.owner.username
            const isOnline = onlineUserIds.has(story.owner._id)

            return (
              <button
                key={story._id}
                type="button"
                onClick={() => setViewerStoryId(story._id)}
                className="flex w-20 shrink-0 flex-col items-center rounded-lg px-1 py-2 text-center transition hover:bg-gray-100"
                title={ownerName}
              >
                <div className="relative mb-2 rounded-full bg-gradient-to-br from-blue-500 via-fuchsia-500 to-amber-400 p-[2px]">
                  {story.owner.profilePicture?.url ? (
                    <img
                      src={story.owner.profilePicture.url}
                      alt=""
                      className="size-14 rounded-full border-2 border-gray-50 object-cover"
                    />
                  ) : (
                    <div className="flex size-14 items-center justify-center rounded-full border-2 border-gray-50 bg-slate-100 text-slate-500">
                      <UserRound className="size-6" />
                    </div>
                  )}
                  <span
                    className={`absolute right-0 bottom-1 size-3 rounded-full border-2 border-gray-50 ${
                      isOnline ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                </div>
                <p className="max-w-full truncate text-xs font-semibold text-black/80">{ownerName}</p>
              </button>
            )
          })
        ) : null}
      </div>

      {showUploadModal && <StoryUploadModal onClose={() => setShowUploadModal(false)} />}
      {viewerStoryId && (
        <StoryViewerModal
          stories={stories}
          initialStoryId={viewerStoryId}
          currentUserId={user?._id}
          onClose={() => setViewerStoryId(null)}
        />
      )}
    </div>
  )
}

export default StoryTray
