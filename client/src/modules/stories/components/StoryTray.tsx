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
  const [viewerState, setViewerState] = useState<{ storyId: string | null; stories: Story[] }>({
    storyId: null,
    stories: []
  })

  const ownStories = useMemo(() => stories.filter((story) => story.owner._id === user?._id), [stories, user?._id])
  const friendStories = useMemo(() => stories.filter((story) => story.owner._id !== user?._id), [stories, user?._id])

  const storyGroupsByOwner = useMemo(() => {
    const map = new Map<string, Story[]>()
    friendStories.forEach((story) => {
      const ownerStories = map.get(story.owner._id) || []
      map.set(story.owner._id, [...ownerStories, story])
    })
    return Array.from(map.values())
  }, [friendStories])

  const openStoryViewer = (ownerStories: Story[], initialStoryId = ownerStories[0]?._id) => {
    if (!ownerStories.length || !initialStoryId) return

    setViewerState({ stories: ownerStories, storyId: initialStoryId })
  }

  return (
    <div className="my-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-black/80">Stories</h3>
        {stories.length > 0 && <span className="text-xs text-gray-500">{stories.length} active</span>}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <div className="flex w-20 shrink-0 flex-col items-center rounded-lg px-1 py-2 text-center transition hover:bg-gray-100">
          <button
            type="button"
            onClick={() => (ownStories.length > 0 ? openStoryViewer(ownStories) : setShowUploadModal(true))}
            className={`relative mb-2 rounded-full p-0.5 ${
              ownStories.length > 0
                ? "bg-linear-to-br from-blue-500 via-fuchsia-500 to-amber-400"
                : "bg-linear-to-br from-slate-200 via-white to-slate-300"
            }`}
            title={ownStories.length > 0 ? "View your story" : "Add story"}
            aria-label={ownStories.length > 0 ? "View your story" : "Add story"}
          >
            {user?.profilePicture?.url ? (
              <img
                src={user.profilePicture.url}
                alt=""
                className="size-14 rounded-full border-2 border-gray-50 object-cover"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full border-2 border-gray-50 bg-slate-100 text-slate-500">
                <UserRound className="size-6" />
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="relative -mt-7 mb-2 ml-10 flex size-5 items-center justify-center rounded-full border-2 border-gray-50 bg-blue-600 text-white"
            title="Add story"
            aria-label="Add story"
          >
            <Plus className="size-3" />
          </button>
          <p className="max-w-full truncate text-xs font-semibold text-black/80">Your story</p>
        </div>

        {storyGroupsByOwner.length > 0
          ? storyGroupsByOwner.map((ownerStories) => {
              const story = ownerStories[0]
              const ownerName = story.owner.displayName || story.owner.username
              const isOnline = onlineUserIds.has(story.owner._id)

              return (
                <button
                  key={story.owner._id}
                  type="button"
                  onClick={() => openStoryViewer(ownerStories, story._id)}
                  className="flex w-20 shrink-0 flex-col items-center rounded-lg px-1 py-2 text-center transition hover:bg-gray-100"
                  title={ownerName}
                >
                  <div className="relative mb-2 rounded-full bg-linear-to-br from-blue-500 via-fuchsia-500 to-amber-400 p-0.5">
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
                    {ownerStories.length > 1 && (
                      <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full border border-gray-50 bg-black/70 text-[10px] font-semibold text-white">
                        {ownerStories.length}
                      </span>
                    )}
                  </div>
                  <p className="max-w-full truncate text-xs font-semibold text-black/80">{ownerName}</p>
                </button>
              )
            })
          : null}
      </div>

      {showUploadModal && <StoryUploadModal onClose={() => setShowUploadModal(false)} />}
      {viewerState.storyId && (
        <StoryViewerModal
          stories={viewerState.stories}
          initialStoryId={viewerState.storyId}
          currentUserId={user?._id}
          onClose={() => {
            setViewerState({ stories: [], storyId: null })
          }}
        />
      )}
    </div>
  )
}

export default StoryTray
