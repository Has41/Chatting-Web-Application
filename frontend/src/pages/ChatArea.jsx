import React from "react"
import Sidebar from "../components/Chat/Sidebar"
import ChatList from "../components/Chat/ChatList"
import Chatbox from "../components/Chat/Chatbox"

const ChatArea = () => {
  return (
    <main className="max-w-full flex">
      <Sidebar />
      <ChatList />
      <Chatbox />
    </main>
  )
}

export default ChatArea
