import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Chat/Sidebar"
import Chatbox from "../components/Chat/Chatbox"

const ChatArea = () => {
  return (
    <main className="flex max-w-full overflow-y-hidden">
      <Sidebar />
      <Outlet />
      <Chatbox />
    </main>
  )
}

export default ChatArea
