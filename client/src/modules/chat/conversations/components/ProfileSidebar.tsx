import ChatInfoFiles from "./ChatInfoFiles"
import ProfileSidebarHeader from "./profile-sidebar/ProfileSidebarHeader"
import ProfileIdentity from "./profile-sidebar/ProfileIdentity"
import ProfileActionShortcuts from "./profile-sidebar/ProfileActionShortcuts"
import GroupMembersPanel from "./profile-sidebar/GroupMembersPanel"
import { useProfileSidebar } from "@chat/conversations/hooks/useProfileSidebar"
import type { Dispatch, SetStateAction } from "react"
import type { Conversation } from "@shared/types"
import type { ProfileSidebarData } from "@chat/conversations/types/profileSidebar"

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
  data: ProfileSidebarData | null
  conversationId?: string
  setData?: Dispatch<SetStateAction<Conversation | null>>
}

const noopSetData: Dispatch<SetStateAction<Conversation | null>> = () => {}

const ProfileSidebar = ({ isOpen, onClose, data, conversationId, setData = noopSetData }: ProfileSidebarProps) => {
  const { state, derived, status, handlers } = useProfileSidebar({
    data,
    conversationId,
    setData,
    onClose
  })

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="bg-opacity-40 fixed inset-0 z-40"
          onClick={handlers.closeSidebar}
          aria-label="Close chat info"
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-96 transform overflow-y-auto bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ProfileSidebarHeader title={derived.title} onClose={handlers.closeSidebar} />

        <ProfileIdentity
          data={data}
          profilePictureUrl={derived.profilePictureUrl}
          groupName={state.groupName}
          groupInfo={state.groupInfo}
          aboutText={derived.aboutText}
          isEditing={state.isEditing}
          isEditingInfo={state.isEditingInfo}
          isLoading={status.isSavingGroupInfo}
          onGroupNameChange={handlers.setGroupName}
          onGroupInfoChange={handlers.setGroupInfo}
          onEditGroupName={() => handlers.setIsEditing(true)}
          onEditGroupInfo={() => handlers.setIsEditingInfo(true)}
          onSaveGroupName={handlers.saveGroupName}
          onSaveGroupInfo={handlers.saveGroupInfo}
        />

        <ProfileActionShortcuts />
        <ChatInfoFiles conversationId={conversationId} />

        <GroupMembersPanel
          enabled={Boolean(data?.conversationType)}
          memberCount={derived.memberRows.length}
          members={derived.filteredMembers}
          searchQuery={state.searchQuery}
          ownerId={derived.ownerId}
          adminIds={derived.adminIds}
          currentUserIsOwner={derived.currentUserIsOwner}
          currentUserIsAdmin={derived.currentUserIsAdmin}
          pendingAction={state.pendingAction}
          onSearchChange={handlers.handleSearchChange}
          onMemberAction={handlers.runMemberAction}
        />
      </div>
    </>
  )
}

export default ProfileSidebar
