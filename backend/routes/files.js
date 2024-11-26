import express from "express"
import { uploadHandler } from "../middlewares/uploads.js"
import { fileUploader } from "../controllers/file.js"

const router = express.Router()

router.post("/upload-files", uploadHandler.single("file"), fileUploader)

export default router
