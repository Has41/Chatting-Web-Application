import React from "react"
import Sidebar from "../components/Chat/Sidebar"
import ChatList from "../components/Chat/ChatList"

const ChatArea = () => {
  return (
    <main className="max-w-full flex">
      <Sidebar />
      <ChatList />
    </main>
  )
}

export default ChatArea
