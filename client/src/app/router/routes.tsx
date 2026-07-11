import { Route, Routes } from "react-router-dom"
import Home from "@/modules/home/pages/Home"
import GetStarted from "@auth/pages/GetStarted"
import OtpAuthPage from "@auth/pages/OtpAuthPage"
import TestFileUpload from "@/modules/test/components/TestFileUpload"
import AuthWrapper from "@app/router/guards/AuthWrapper"
import ProtectedRoute from "@app/router/guards/ProtectedRoute"
import ChatLayout from "@chat/layout/ChatLayout"
import StartChat from "@chat/navigation/components/StartChat"
import Chatbox from "@chat/conversations/components/Chatbox"
import GroupChatbox from "@chat/conversations/components/GroupChatbox"
import ChannelChatbox from "@chat/channels/components/ChannelChatbox"
import {
  AUTH_PAGE,
  CHAT_PAGE,
  CHAT_CONVERSATION,
  CHANNEL_CONVERSATION,
  NEW_CHAT_PAGE,
  OTP_PAGE,
  GROUP_CONVERSATION
} from "@shared/constants/routePaths"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route
        path={AUTH_PAGE}
        element={
          <AuthWrapper>
            <GetStarted />
          </AuthWrapper>
        }
      />

      <Route path={OTP_PAGE} element={<OtpAuthPage />} />
      <Route path="/test" element={<TestFileUpload />} />

      <Route
        path={CHAT_PAGE}
        element={
          <ProtectedRoute>
            <ChatLayout />
          </ProtectedRoute>
        }
      >
        <Route>
          <Route index element={<StartChat />} />
          <Route path={NEW_CHAT_PAGE} element={<Chatbox />} />
          <Route path={CHAT_CONVERSATION} element={<Chatbox />} />
          <Route path={GROUP_CONVERSATION} element={<GroupChatbox />} />
          <Route path={CHANNEL_CONVERSATION} element={<ChannelChatbox />} />
        </Route>
      </Route>
    </Routes>
  )
}
