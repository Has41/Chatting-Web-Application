import React from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import AuthProvider from "@auth/services/authContext"
import ChatProvider from "@chat/conversations/services/chatContext"
import queryClient from "@shared/api/query-client"
import { ConfirmAction } from "@shared/components/callables/ConfirmAction"

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          {children}
          <ConfirmAction />
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
