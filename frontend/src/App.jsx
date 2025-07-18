import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import GetStarted from "./pages/GetStarted"
import OtpAuthPage from "./pages/OtpAuthPage"
import TestFileUpload from "./components/Test/TestFileUpload"
import AuthWrapper from "./components/Shared/AuthWrapper"
import ProtectedRoute from "./components/Shared/ProtectedRoute"
import ChatArea from "./pages/ChatArea"
import StartChat from "./components/Chat/StartChat"
import Chatbox from "./components/Chat/Chatbox"
import { AUTH_PAGE, CHAT_PAGE, CHAT_CONVERSATION, NEW_CHAT_PAGE, OTP_PAGE, GROUP_CONVERSATION } from "./constants/routePaths"
import "./App.css"
import GroupChatbox from "./components/Chat/GroupChatbox"

const App = () => {
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
            <ChatArea />
          </ProtectedRoute>
        }
      >
        <Route>
          <Route index element={<StartChat />} />
          <Route path={NEW_CHAT_PAGE} element={<Chatbox />} />
          <Route path={CHAT_CONVERSATION} element={<Chatbox />} />
          <Route path={GROUP_CONVERSATION} element={<GroupChatbox />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
