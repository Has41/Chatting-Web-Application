const joinGroup = async (socket, conversationId, userId) => {
  try {
    const conversation = await cacheConvoData(conversationId, userId)

    if (!conversation) {
      console.error(`Conversation with ID ${conversationId} not found!`)
      return
    }

    const groupOwnerId = conversation.groupOwner.toString()
    const isParticipant = conversation.participants.some((participant) => participant.toString() === userId)

    // Check if the user is either the group owner or a participant
    if (userId === groupOwnerId || isParticipant) {
      socket.join(conversationId)
      console.log(`User ${userId} joined group room: ${conversationId}`)
    } else {
      console.error(`User ${userId} is not authorized to join group room: ${conversationId}`)
    }
  } catch (err) {
    console.error(`Error in joinGroup for conversation ${conversationId} and user ${userId}:`, err)
    throw errorHandler(500, `Failed to join group conversation: ${err?.message}`)
  }
}

export default joinGroup
