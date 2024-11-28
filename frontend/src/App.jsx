import React from "react"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
// import PrivateTest from "./pages/PrivateTest"
// import GroupTest from "./pages/GroupTest"
import GetStarted from "./pages/GetStarted"
import ChatArea from "./pages/ChatArea"

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        {/* <Route index element={<PrivateTest />} /> */}
        {/* <Route index element={<GroupTest />} /> */}
        <Route path="/auth" element={<GetStarted />} />
        <Route path="/chat" element={<ChatArea />} />
      </Routes>
    </>
  )
}

export default App
