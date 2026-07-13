import { Check, Pencil } from "lucide-react"
import ProfileAvatar from "./ProfileAvatar"
import RoundIconButton from "./RoundIconButton"
import type { ProfileSidebarData } from "@chat/conversations/types/profileSidebar"

interface ProfileIdentityProps {
  data: ProfileSidebarData | null
  profilePictureUrl?: string
  groupName: string
  groupInfo: string
  aboutText?: string
  isEditing: boolean
  isEditingInfo: boolean
  isLoading: boolean
  onGroupNameChange: (value: string) => void
  onGroupInfoChange: (value: string) => void
  onEditGroupName: () => void
  onEditGroupInfo: () => void
  onSaveGroupName: () => void
  onSaveGroupInfo: () => void
}

const ProfileIdentity = ({
  data,
  profilePictureUrl,
  groupName,
  groupInfo,
  aboutText,
  isEditing,
  isEditingInfo,
  isLoading,
  onGroupNameChange,
  onGroupInfoChange,
  onEditGroupName,
  onEditGroupInfo,
  onSaveGroupName,
  onSaveGroupInfo
}: ProfileIdentityProps) => (
  <div className="p-4 text-center">
    <ProfileAvatar data={data} profilePictureUrl={profilePictureUrl} />
    <div className="mt-4 flex items-center justify-center gap-2">
      {isEditing && data?.conversationType ? (
        <>
          <input
            type="text"
            value={groupName}
            onChange={(event) => onGroupNameChange(event.target.value)}
            className="border-b border-gray-400 text-center text-lg font-bold outline-none"
            aria-label="Group name"
            autoFocus
          />
          <RoundIconButton onClick={onSaveGroupName} disabled={isLoading} label="Save group name">
            <Check className="size-4 text-white" strokeWidth={2} />
          </RoundIconButton>
        </>
      ) : (
        <>
          <h4 className="text-lg font-bold">
            {("username" in (data ?? {}) ? data?.username : undefined) || data?.groupName || "Unknown"}
          </h4>
          {data?.conversationType && (
            <RoundIconButton onClick={onEditGroupName} label="Edit group name">
              <Pencil className="size-4 text-white" strokeWidth={1.5} />
            </RoundIconButton>
          )}
        </>
      )}
    </div>
    <div className="mt-2 flex items-center justify-center gap-x-2 text-sm text-gray-600">
      {isEditingInfo ? (
        <>
          <input
            type="text"
            value={groupInfo}
            onChange={(event) => onGroupInfoChange(event.target.value)}
            className="border-b border-gray-400 text-center text-sm outline-none"
            aria-label="Group info"
            autoFocus
          />
          <RoundIconButton onClick={onSaveGroupInfo} disabled={isLoading} label="Save group info">
            <Check className="size-4 text-white" strokeWidth={2} />
          </RoundIconButton>
        </>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <p>{aboutText || (data?.conversationType ? "No group info available" : "No bio available")}</p>
          {data?.conversationType && (
            <RoundIconButton onClick={onEditGroupInfo} label="Edit group info">
              <Pencil className="size-4 text-white" strokeWidth={1.5} />
            </RoundIconButton>
          )}
        </div>
      )}
    </div>
  </div>
)

export default ProfileIdentity
