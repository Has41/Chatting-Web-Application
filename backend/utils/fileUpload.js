import { uploadImage, uploadAudio, uploadVideo, uploadDocs } from "../middlewares/uploads.js"
import errorHandler from "./errorHandler.js"

const getUploadHandler = (type) => {
  console.log(`Getting upload handler for type: ${type}`)
  switch (type) {
    case "image":
      return uploadImage.single("file")
    case "audio":
      return uploadAudio.single("file")
    case "video":
      return uploadVideo.single("file")
    case "document":
      return uploadDocs.single("file")
    default:
      throw errorHandler(500, `Unsupported file type: ${type}`)
  }
}

export default getUploadHandler
