import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@auth": path.resolve(__dirname, "./src/modules/auth"),
      "@chat": path.resolve(__dirname, "./src/modules/chat"),
      "@calls": path.resolve(__dirname, "./src/modules/calls"),
      "@profile": path.resolve(__dirname, "./src/modules/profile"),
      "@stories": path.resolve(__dirname, "./src/modules/stories"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@styles": path.resolve(__dirname, "./src/styles")
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true
      }
    }
  }
})
