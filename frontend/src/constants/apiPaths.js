const AUTH_PATHS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  OTHER_DETAIL: "/api/auth/other-details",
  SAVE_PROFILE_PIC: "/api/auth/profile-pic",
  LOG_OUT: "/api/auth/logout",
  VERIFY_OTP: "/api/auth/verify-otp",
  RESEND_OTP: "/api/auth/resend-otp",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password"
}

const USER_PATHS = {
  GET_INFO: "/api/users/get-info",
  EDIT_PROFILE: "/api/users/edit-info",
  DELETE_ACCOUNT: "/api/users/delete-account",
  TOGGLE_DARK_MODE: "/api/users/toggle-darkmode",
  ADD_INTEREST: "/api/users/add-interests",
  REMOVE_INTEREST: "/api/users/remove-interests",
  SEND_FRIEND_REQUEST: "/api/users/send-friend-request",
  RESPOND_FRIEND_REQUEST: "/api/users/respond-friend-request",
  GET_FRIENDS_AND_REQUESTS: "/api/users/get-friends-and-requests",
  GET_FRIENDS_AND_CONVERSATIONS: "/api/users/get-friends-and-conversations",
  REMOVE_FRIEND: "/api/users/remove-friend",
  SEARCH_USER_CONVO_DATA: "/api/users/search-user-conversations-data",
  SEARCH_FRIENDS_USERS: "/api/users/search-friends-users"
}

const MESSAGE_PATHS = {
  ADD_REACTION: "/api/messages/add-reaction",
  EDIT_MESSAGE: "/api/messages/edit-message",
  DELETE_MESSAGE: "/api/messages/remove-message"
}

const CONVERSATION_PATHS = {
  GET_CURRENT_CONVO: "/api/conversations/get-current-convo",
  GET_CURRENT_MESSAGES: "/api/conversations/get-current-convo-messages",
  GET_CONVERSATIONS_OF_USER: "/api/conversations/get-conversations",
  GET_GROUP_PARTICIPANTS: "/api/conversations/get-group-participants",
  CREATE_GROUP: "/api/conversations/create-group",
  EDIT_GROUP_INFO: "/api/conversations/edit-group-info",
  LEAVE_GROUP: "/api/conversations/leave-group/:convoId",
  ADD_PARTICIPANTS: "/api/conversations/add-participants",
  REMOVE_PARTICIPANTS: "/api/conversations/remove-participants/:convoId",
  CHANGE_OWNERSHIP: "/api/conversations/change-ownership/:convoId/:newOwnerId"
}

const FILE_PATHS = {
  GENERATE_SIGNATURE: "/api/files/generate-signature"
}

export { AUTH_PATHS, USER_PATHS, MESSAGE_PATHS, CONVERSATION_PATHS, FILE_PATHS }
