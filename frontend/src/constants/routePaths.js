const AUTH_PAGE = "/auth"
const CHAT_PAGE = "/chat"
const CHAT_CONVERSATION = "conversation/:conversationId"
const NEW_CHAT_PAGE = "new/:userId"
const OTP_PAGE = "/verify-otp"

const getChatConversationRoute = (conversationId) => `conversation/${conversationId}`

const getNewChatRoute = (userId) => `new/${userId}`

export { AUTH_PAGE, CHAT_PAGE, NEW_CHAT_PAGE, CHAT_CONVERSATION, OTP_PAGE, getChatConversationRoute, getNewChatRoute }
