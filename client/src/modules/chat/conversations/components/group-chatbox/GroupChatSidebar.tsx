import ProfileSidebar from "../ProfileSidebar"
import type { Dispatch, SetStateAction } from "react"
import type { Conversation } from "@shared/types"

const GroupChatSidebar = ({
  isOpen,
  groupData,
  conversationId,
  setGroupData,
  onClose
}: {
  isOpen: boolean
  groupData: Conversation | null
  conversationId?: string
  setGroupData: Dispatch<SetStateAction<Conversation | null>>
  onClose: () => void
}) => (
  <ProfileSidebar
    isOpen={isOpen}
    setData={setGroupData}
    onClose={onClose}
    data={groupData}
    conversationId={conversationId}
  />
)

export default GroupChatSidebar
