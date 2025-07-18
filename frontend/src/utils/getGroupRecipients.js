const getGroupRecipients = (userData, currentUserId) => {
  if (!userData || userData.participants?.length === 0) return []

  const { participants = [], groupOwner } = userData

  return [...participants, groupOwner].filter((member) => member?._id && member._id !== currentUserId)
}

export default getGroupRecipients
