import express from "express"
import { uploadHandler } from "../middlewares/uploads.js"
import {
  fileUploader,
  generateSignatureForAudio,
  generateSignatureForOther,
  generateSignatureForImage,
  generateSignatureForVideo,
} from "../controllers/file.js"

const router = express.Router()

router.post("/upload-files", uploadHandler.single("file"), fileUploader)
router.post("/generate-signature/image", generateSignatureForImage)
router.post("/generate-signature/video", generateSignatureForVideo)
router.post("/generate-signature/audio", generateSignatureForAudio)
router.post("/generate-signature/other", generateSignatureForOther)

export default router
