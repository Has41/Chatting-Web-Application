import express from "express"
import { deleteCloudinaryMediaMessage, generateSignatureUniversal } from "../controllers/file.js"
import isAuthentic from "../middlewares/checkAuth.js"
import { validateFileIds, validateSignatureBody } from "../validators/fileValidators.js"
import validateApiData from "../utils/apiValidator.js"

const router = express.Router()

router.post("/generate-signature", validateSignatureBody, validateApiData, generateSignatureUniversal)
router.delete("/remove-file/:publicId", validateFileIds, validateApiData, isAuthentic, deleteCloudinaryMediaMessage)

export default router
