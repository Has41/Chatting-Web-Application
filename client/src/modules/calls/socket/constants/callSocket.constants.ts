export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

export const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
}
