import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Chat/Sidebar"
import Chatbox from "../components/Chat/Chatbox"

const ChatArea = () => {
  return (
    <main className="max-w-full flex">
      <Sidebar />
      <Outlet />
      <Chatbox />
    </main>
  )
}

export default ChatArea
