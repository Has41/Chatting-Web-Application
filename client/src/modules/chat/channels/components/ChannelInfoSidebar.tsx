import useAuth from "@auth/hooks/useAuth"
import type { Channel } from "@shared/types"
import { useChannelInfoActions } from "../hooks/useChannelInfoActions"
import { useChannelInfoPermissions } from "../hooks/useChannelInfoPermissions"
import AddChannelMembersModal from "./channel-info/AddChannelMembersModal"
import ChannelDangerFooter from "./channel-info/ChannelDangerFooter"
import ChannelDetailsSection from "./channel-info/ChannelDetailsSection"
import ChannelInfoHeader from "./channel-info/ChannelInfoHeader"
import ChannelMembersSection from "./channel-info/ChannelMembersSection"
import ChannelInfoFiles from "./ChannelInfoFiles"

interface ChannelInfoSidebarProps {
  isOpen: boolean
  onClose: () => void
  channel: Channel
}

const ChannelInfoSidebar = ({ isOpen, onClose, channel }: ChannelInfoSidebarProps) => {
  const { user } = useAuth()
  const permissions = useChannelInfoPermissions(channel, user?._id)
  const actions = useChannelInfoActions({
    channel,
    currentUserIsAdmin: permissions.currentUserIsAdmin,
    onClose
  })

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-black/10"
          onClick={onClose}
          aria-label="Close channel info"
        />
      )}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-108 max-w-[92vw] transform flex-col bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ChannelInfoHeader currentUserIsAdmin={permissions.currentUserIsAdmin} onClose={onClose} />

        <div className="flex-1 overflow-y-auto">
          <ChannelDetailsSection
            channel={channel}
            VisibilityIcon={permissions.VisibilityIcon}
            draft={actions.draft}
            currentUserIsAdmin={permissions.currentUserIsAdmin}
            isSaving={actions.isSaving}
            onDraftChange={actions.setDraft}
            onSave={actions.handleSave}
          />

          <ChannelInfoFiles channelId={channel._id} />

          <ChannelMembersSection
            members={permissions.members}
            memberCount={channel.members.length}
            ownerId={permissions.ownerId}
            adminIds={permissions.adminIds}
            currentUserIsOwner={permissions.currentUserIsOwner}
            currentUserIsAdmin={permissions.currentUserIsAdmin}
            pendingAction={actions.pendingAction}
            onAddMembers={() => actions.setShowAddMembers(true)}
            onMemberAction={actions.handleMemberAction}
          />
        </div>

        <ChannelDangerFooter
          currentUserIsMember={permissions.currentUserIsMember}
          currentUserIsOwner={permissions.currentUserIsOwner}
          leavePending={actions.leavePending}
          deletePending={actions.deletePending}
          onLeave={actions.handleLeave}
          onDelete={actions.handleDelete}
        />

        {actions.showAddMembers && (
          <AddChannelMembersModal
            channel={channel}
            isAdding={actions.isAddingMembers}
            onClose={() => actions.setShowAddMembers(false)}
            onAdd={actions.handleAddMembers}
          />
        )}
      </aside>
    </>
  )
}

export default ChannelInfoSidebar
