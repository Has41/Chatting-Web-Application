import Message from "../models/Message.js"
import errorHandler from "../utils/errorHandler.js"
import { v4 as uuidv4 } from "uuid"
import cloudinary from "../config/cloudinary.js"

const generateSignatureUniversal = (req, res, next) => {
  try {
    const { folder, uploadType, mimeType } = req.body

    const timestamp = Math.round(Date.now() / 1000)
    let publicId = ""
    let resourceType = "auto"
    let transformation = undefined
    let format = undefined
    let eager = undefined

    if (mimeType.startsWith("image/")) {
      if (uploadType === "document" || uploadType === "other") {
        publicId = `docs_${uuidv4()}`
        resourceType = "image"
        eager = "pg_1,f_png,w_500"
      } else {
        publicId = `image_${uuidv4()}`
        resourceType = "image"
        format = "webp"
        transformation =
          uploadType === "profile"
            ? "w_350,h_350,c_limit,f_auto,q_auto"
            : uploadType === "chat"
            ? "w_1280,h_720,c_limit,f_auto,q_auto"
            : "w_500,h_500,c_limit,f_auto,q_auto"
      }
    } else if (mimeType.startsWith("video/")) {
      publicId = `video_${uuidv4()}`
      resourceType = "video"
      format = "webm"
      transformation =
        uploadType === "status"
          ? "w_720,h_720,c_limit,f_auto,q_auto,so_0"
          : uploadType === "chat"
          ? "w_1280,h_720,c_limit,f_auto,q_auto,so_0"
          : "w_1080,h_720,c_limit,f_auto,q_auto,so_0"
    } else if (mimeType.startsWith("audio/")) {
      publicId = `audio_${uuidv4()}`
      resourceType = "raw"
      format = "mp3"
      transformation = "q_60"
    } else {
      publicId = `docs_${uuidv4()}`
      resourceType = "raw"
      eager = "pg_1,f_png,w_500"
    }

    const paramsToSign = {
      timestamp,
      public_id: publicId,
      folder,
    }

    if (transformation) paramsToSign.transformation = transformation
    if (format) paramsToSign.format = format
    if (eager) paramsToSign.eager = eager

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET)

    return res.status(200).json({
      signature,
      timestamp,
      public_id: publicId,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      format,
      transformation,
      eager,
      resource_type: resourceType,
    })
  } catch (err) {
    console.error(err)
    return next(errorHandler(500, err))
  }
}

const deleteCloudinaryMediaMessage = async (req, res, next) => {
  try {
    const { publicId, messageId } = req.params

    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === "ok" || result.result === "not_found") {
      if (messageId) {
        const deleteResult = await Message.deleteOne({ _id: messageId })

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({
            message: "Media deleted from Cloudinary, but message not found in DB",
          })
        }
      }
      return res.status(200).json({ message: "Deleted successfully" })
    } else {
      return res.status(500).json({ error: "Failed to delete" })
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

export { deleteCloudinaryMediaMessage, generateSignatureUniversal }
