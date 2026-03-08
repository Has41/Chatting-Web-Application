import type { User } from "@shared/types";

interface GroupData {
  participants?: (User | string)[];
  groupOwner?: string | User;
}

const getGroupRecipients = (
  userData: GroupData | null,
  currentUserId: string,
): User[] => {
  if (!userData || !userData.participants || userData.participants.length === 0)
    return [];

  const { participants = [], groupOwner } = userData;
  const allMembers = [...participants, groupOwner];

  return allMembers
    .filter((member): member is User => {
      if (!member) return false;
      if (typeof member === "string") return member !== currentUserId;
      return member._id !== currentUserId;
    })
    .filter(
      (member, index, self) =>
        index === self.findIndex((m) => m._id === member._id),
    );
};
export default getGroupRecipients;
