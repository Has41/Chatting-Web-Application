import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import App from "./App.jsx"
import "./index.css"
import AuthProvider from "./context/AuthContext.jsx"
import ChatProvider from "./context/ChatContext.jsx"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  </BrowserRouter>
)
