import { Server } from "socket.io"
import userSocketMap from "./utils/socketMap.js"
import { sendMessage, markMessageAsSeen } from "./handlers/messageHandlers.js"
import joinGroup from "./handlers/groupHandlers.js"

let io

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // TODO: Change this for deployment
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  console.log("Socket.io server initialized!")

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`)
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId)
        break
      }
    }
  }

  const setupSocketEvents = (socket) => {
    socket.on("sendMessage", async (messageData, fileData) => {
      await sendMessage(messageData, fileData)
    })

    socket.on("markMessageAsSeen", async (conversationId, userId, conversationType) => {
      await markMessageAsSeen(conversationId, userId, conversationType)
    })

    socket.on("join-group", async (conversationId, userId) => {
      await joinGroup(socket, conversationId, userId)
    })
  }

  io.on("connection", (socket) => {
    console.log("Client connected!")
    const userId = socket.handshake.query.userId

    if (userId) {
      userSocketMap.set(userId, socket.id)
    } else {
      socket.disconnect(true)
      return
    }

    //* Event Handlers
    setupSocketEvents(socket)

    socket.on("checkIfOnline", (userId, callback) => {
      const isOnline = userSocketMap.has(userId)
      callback(isOnline)
    })

    socket.on("disconnect", () => disconnect(socket))
  })
}

export { setupSocket, io }
