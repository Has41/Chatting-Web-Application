import { MoreVertical, Phone, Video } from "lucide-react"
import { getGroupInitial } from "@chat/conversations/utils/groupChatbox"
import type { Conversation } from "@shared/types"

const GroupChatHeader = ({
  groupData,
  onOpenInfo
}: {
  groupData: Conversation | null
  onOpenInfo: () => void
}) => (
  <nav className="flex items-center justify-between border-b px-4 py-3 text-black/80">
    <button
      type="button"
      onClick={onOpenInfo}
      className="flex cursor-pointer items-center gap-x-3 bg-transparent p-0 text-left"
      aria-label="Open group info"
    >
      {groupData?.groupPicture?.url ? (
        <img src={groupData.groupPicture.url} alt={groupData.groupName} className="size-10 rounded-full object-cover" />
      ) : (
        <div className="flex size-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-white">
          {getGroupInitial(groupData?.groupName)}
        </div>
      )}
      <div className="flex items-center gap-x-2">
        <h1 className="mb-[0.1rem] font-semibold">{groupData?.groupName || "Group Chat"}</h1>
      </div>
    </button>

    <div className="flex items-center gap-4">
      <button type="button" className="inline-flex size-9 items-center justify-center rounded-full transition hover:bg-gray-100" aria-label="Group audio call" title="Audio call">
        <Phone className="size-5" />
      </button>
      <button type="button" className="inline-flex size-9 items-center justify-center rounded-full transition hover:bg-gray-100" aria-label="Group video call" title="Video call">
        <Video className="size-5" />
      </button>
      <button type="button" className="inline-flex size-9 items-center justify-center rounded-full transition hover:bg-gray-100" aria-label="More group options" title="More">
        <MoreVertical className="size-5" />
      </button>
    </div>
  </nav>
)

export default GroupChatHeader
