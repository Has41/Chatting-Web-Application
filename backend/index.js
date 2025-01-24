import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import allRoutes from "./routes/index.js"
import { setupSocket } from "./socket.js"

const app = express()
const PORT = process.env.PORT

//*All Middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use("/api", allRoutes)

app.use((err, req, res, next) => {
  console.error("Error:", err.message, err.stack)

  const status = err.statusCode || 500
  const message = err.message || "Internal Server Error!"
  return res.status(status).json({ message, stack: err.stack })
})

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT)
    console.log("Database Connected!")
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

connectDB()

const server = app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`)
})

setupSocket(server)
