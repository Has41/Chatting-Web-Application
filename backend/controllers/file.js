import errorHandler from "../utils/errorHandler.js"
import { v4 as uuidv4 } from "uuid"
import { v2 as cloudinary } from "cloudinary"

const fileUploader = (req, res, next) => {
  try {
    const file = req.file
    console.log("File request", file)

    if (!file) {
      return next(errorHandler(400, "No file uploaded"))
    }

    const fileData = {
      path: file.path,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      fileType: file.mimetype.split("/")[0],
    }

    res.status(200).json(fileData)
  } catch (err) {
    return next(errorHandler(500, err))
  }
}

const generateSignatureForImage = (req, res, next) => {
  try {
    const { folder, uploadType } = req.body
    const timestamp = Math.round(new Date().getTime() / 1000)
    const publicId = `image_${uuidv4()}`
    const format = "webp"
    let transformation

    if (uploadType === "profile") {
      transformation = "w_350,h_350,c_limit,f_auto,q_auto"
    } else if (uploadType === "chat") {
      transformation = "w_1280,h_720,c_limit,f_auto,q_auto"
    } else {
      transformation = "w_500,h_500,c_limit,f_auto,q_auto"
    }

    const params = {
      timestamp,
      transformation,
      public_id: publicId,
      folder,
      format,
    }

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)

    return res.status(200).json({
      signature,
      timestamp,
      public_id: publicId,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      format,
      transformation,
    })
  } catch (err) {
    console.error(err)
    return next(errorHandler(500, err))
  }
}

const generateSignatureForVideo = (req, res, next) => {
  try {
    const { folder, uploadType } = req.body
    const timestamp = Math.round(new Date().getTime() / 1000)
    const publicId = `video_${uuidv4()}`
    const format = "webm"
    const resourceType = "video"
    let transformation

    if (uploadType === "status") {
      transformation = "w_720,h_720,c_limit,f_auto,q_auto,so_0"
    } else if (uploadType === "chat") {
      transformation = "w_1280,h_720,c_limit,f_auto,q_auto,so_0"
    } else {
      transformation = "w_1080,h_720,c_limit,f_auto,q_auto,so_0"
    }

    const params = {
      timestamp,
      transformation,
      public_id: publicId,
      folder,
      format,
    }

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)

    return res.status(200).json({
      signature,
      timestamp,
      public_id: publicId,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      format,
      transformation,
      resource_type: resourceType,
    })
  } catch (err) {
    console.error(err)
    return next(errorHandler(500, err))
  }
}

const generateSignatureForAudio = (req, res, next) => {
  try {
    const { folder } = req.body
    const timestamp = Math.round(new Date().getTime() / 1000)
    const publicId = `audio_${uuidv4()}`
    const transformation = "q_60"
    const format = "mp3"
    const resourceType = "raw"

    const params = {
      timestamp,
      transformation,
      public_id: publicId,
      folder,
      format,
    }

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)

    return res.status(200).json({
      signature,
      timestamp,
      public_id: publicId,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      format,
      transformation,
      resource_type: resourceType,
    })
  } catch (err) {
    console.error(err)
    return next(errorHandler(500, err))
  }
}

const generateSignatureForOther = (req, res, next) => {
  try {
    const { folder } = req.body
    const timestamp = Math.round(new Date().getTime() / 1000)
    const publicId = `docs_${uuidv4()}`
    const eager = "pg_1,f_png,w_500"
    const resourceType = "raw"

    const params = {
      timestamp,
      eager,
      public_id: publicId,
      folder,
    }

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)

    return res.status(200).json({
      signature,
      timestamp,
      public_id: publicId,
      folder,
      eager,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      resource_type: resourceType,
    })
  } catch (err) {
    console.error(err)
    return next(errorHandler(500, err))
  }
}

export {
  fileUploader,
  generateSignatureForImage,
  generateSignatureForVideo,
  generateSignatureForAudio,
  generateSignatureForOther,
}
