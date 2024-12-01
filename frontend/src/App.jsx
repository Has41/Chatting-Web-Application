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

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/auth" element={<GetStarted />} />
        <Route path="/chat" element={<ChatArea />}>
          <Route index element={<ChatList />} />
          <Route path="friends" element={<FriendList />} />
          <Route path="calls" element={<ChatCalls />} />
          <Route path="channels" element={<ChannelsList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
