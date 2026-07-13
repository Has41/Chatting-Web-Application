import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ConfirmAction } from "@shared/components/callables/ConfirmAction"
import { CHAT_PAGE } from "@shared/constants/routePaths"
import type { Channel, User } from "@shared/types"
import {
  useAddChannelMembers,
  useDeleteChannel,
  useDemoteChannelAdmin,
  useLeaveChannel,
  usePromoteChannelAdmin,
  useRemoveChannelMembers,
  useTransferChannelOwnership,
  useUpdateChannel
} from "../queries/useChannels"
import type { MemberAction } from "../types/channelInfo"
import { getChannelDraft, getMemberConfirmation } from "../utils/channelInfo"

interface UseChannelInfoActionsOptions {
  channel: Channel
  currentUserIsAdmin: boolean
  onClose: () => void
}

export const useChannelInfoActions = ({ channel, currentUserIsAdmin, onClose }: UseChannelInfoActionsOptions) => {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(() => getChannelDraft(channel))
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [showAddMembers, setShowAddMembers] = useState(false)

  const updateChannel = useUpdateChannel()
  const addMembers = useAddChannelMembers()
  const leaveChannel = useLeaveChannel()
  const deleteChannel = useDeleteChannel()
  const removeMember = useRemoveChannelMembers()
  const transferOwnership = useTransferChannelOwnership()
  const promoteAdmin = usePromoteChannelAdmin()
  const demoteAdmin = useDemoteChannelAdmin()

  if (draft.channelId !== channel._id) {
    setDraft(getChannelDraft(channel))
  }

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentUserIsAdmin || !draft.name.trim()) return

    updateChannel.mutate({
      channelId: channel._id,
      payload: {
        name: draft.name.trim(),
        description: draft.description.trim(),
        visibility: draft.visibility,
        sendPermissions: draft.sendPermissions
      }
    })
  }

  const handleMemberAction = async (memberAction: MemberAction, target: User) => {
    const accepted = await ConfirmAction.call(getMemberConfirmation(memberAction, target, channel.name))
    if (!accepted) return

    setPendingAction(`${memberAction}:${target._id}`)

    try {
      if (memberAction === "remove") {
        await removeMember.mutateAsync({ channelId: channel._id, members: [target._id] })
      } else if (memberAction === "transfer") {
        await transferOwnership.mutateAsync({ channelId: channel._id, newOwnerId: target._id })
      } else if (memberAction === "promote") {
        await promoteAdmin.mutateAsync({ channelId: channel._id, targetUserId: target._id })
      } else {
        await demoteAdmin.mutateAsync({ channelId: channel._id, targetUserId: target._id })
      }
    } finally {
      setPendingAction(null)
    }
  }

  const handleLeave = async () => {
    const accepted = await ConfirmAction.call({
      title: "Leave channel?",
      description: `You will leave ${channel.name} and lose access unless someone adds you again.`,
      confirmLabel: "Leave",
      tone: "warning"
    })
    if (!accepted) return

    await leaveChannel.mutateAsync(channel._id)
    onClose()
    navigate(CHAT_PAGE)
  }

  const handleDelete = async () => {
    const accepted = await ConfirmAction.call({
      title: "Delete channel?",
      description: `${channel.name} and its messages will be deleted. This cannot be undone.`,
      confirmLabel: "Delete",
      tone: "danger"
    })
    if (!accepted) return

    await deleteChannel.mutateAsync(channel._id)
    onClose()
    navigate(CHAT_PAGE)
  }

  const handleAddMembers = async (memberIds: string[]) => {
    await addMembers.mutateAsync({ channelId: channel._id, members: memberIds })
    setShowAddMembers(false)
  }

  return {
    draft,
    pendingAction,
    showAddMembers,
    isSaving: updateChannel.isPending,
    isAddingMembers: addMembers.isPending,
    leavePending: leaveChannel.isPending,
    deletePending: deleteChannel.isPending,
    setDraft,
    setShowAddMembers,
    handleSave,
    handleMemberAction,
    handleLeave,
    handleDelete,
    handleAddMembers
  }
}
