const AUTH_PAGE = "/auth";
const CHAT_PAGE = "/chat";
const CHAT_CONVERSATION = "conversation/:conversationId";
const GROUP_CONVERSATION = "group/:conversationId";
const NEW_CHAT_PAGE = "new/:userId";
const OTP_PAGE = "/verify-otp";

const getChatConversationRoute = (conversationId: string): string =>
  `conversation/${conversationId}`;
const getGroupConversationRoute = (conversationId: string): string =>
  `group/${conversationId}`;
const getNewChatRoute = (userId: string): string => `new/${userId}`;

export {
  AUTH_PAGE,
  CHAT_PAGE,
  NEW_CHAT_PAGE,
  CHAT_CONVERSATION,
  OTP_PAGE,
  GROUP_CONVERSATION,
  getChatConversationRoute,
  getGroupConversationRoute,
  getNewChatRoute,
};
