import { createPortal } from "react-dom"
import GroupModalHeader from "./group-modal/GroupModalHeader"
import GroupModalSearch from "./group-modal/GroupModalSearch"
import GroupModalMemberSections from "./group-modal/GroupModalMemberSections"
import CreateGroupButton from "./group-modal/CreateGroupButton"
import { useGroupModal } from "@chat/conversations/hooks/useGroupModal"

interface GroupModalProps {
  onClose: () => void
}

const GroupModal = ({ onClose }: GroupModalProps) => {
  const { state, data, selectedIdSet, filteredData, status, handlers } = useGroupModal({ onClose })

  return createPortal(
    <div className="font-poppins fixed inset-0 z-50 flex items-center justify-center shadow-lg backdrop-blur-sm">
      <div className="z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <GroupModalHeader onClose={onClose} />

        <GroupModalSearch searchQuery={state.searchQuery} onSearchQueryChange={handlers.setSearchQuery} />

        <GroupModalMemberSections
          currentUserId={data?._id}
          friends={filteredData.filteredFriends}
          conversations={filteredData.nonFriendConversations}
          selectedIdSet={selectedIdSet}
          onToggleUser={handlers.toggleSelectedId}
        />

        <CreateGroupButton
          selectedCount={state.selectedIds.length}
          isLoading={status.isCreatingGroup}
          onClick={handlers.createGroup}
        />
      </div>
    </div>,
    document.body
  )
}

export default GroupModal
