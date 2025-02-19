import React from "react"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import GetStarted from "./pages/GetStarted"
import ChatArea from "./pages/ChatArea"
import ChatList from "./components/Chat/ChatList"
import FriendList from "./components/Chat/FriendList"
import ChatCalls from "./components/Chat/ChatCalls"
import ChannelsList from "./components/Chat/ChannelsList"
import Settings from "./components/Chat/Settings"
import {
  AUTH_PAGE,
  CALLS_PAGE,
  CHANNELS_PAGE,
  CHAT_PAGE,
  FRIENDS_PAGE,
  OTP_PAGE,
  SETTINGS_PAGE
} from "./constants/routePaths"
import OtpAuthPage from "./pages/OtpAuthPage"
import TestFileUpload from "./components/Test/TestFileUpload"
import "./App.css"

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path={AUTH_PAGE} element={<GetStarted />} />
      <Route path={CHAT_PAGE} element={<ChatArea />}>
        <Route index element={<ChatList />} />
        <Route path={FRIENDS_PAGE} element={<FriendList />} />
        <Route path={CALLS_PAGE} element={<ChatCalls />} />
        <Route path={CHANNELS_PAGE} element={<ChannelsList />} />
        <Route path={SETTINGS_PAGE} element={<Settings />} />
      </Route>
      <Route path={OTP_PAGE} element={<OtpAuthPage />} />
      <Route path={"/test"} element={<TestFileUpload />} />
    </Routes>
  )
}

export default App
