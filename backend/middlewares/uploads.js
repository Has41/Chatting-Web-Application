import { v2 as cloudinary } from "cloudinary"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Function to determine the folder and resource type based on the file type
const folderAndResourceType = (req, file) => {
  const fileType = file.mimetype.split("/")[0] // 'image', 'audio', 'video', etc.
  switch (fileType) {
    case "image":
      return { folder: "Image_Files", resourceType: "image" }
    case "audio":
      return { folder: "Audio_Files", resourceType: "video" } // Cloudinary treats audio as 'video'
    case "video":
      return { folder: "Video_Files", resourceType: "video" }
    case "application":
      return { folder: "Documents", resourceType: "raw" }
    default:
      return { folder: "Miscellaneous_Files", resourceType: "auto" }
  }
}

// Function to create multer storage with dynamic folder and resource type
const createStorage = (folder, resourceType, format, transformations = []) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const { folder: dynamicFolder, resourceType: dynamicResourceType } = folderAndResourceType(req, file)
      const fileType = file.mimetype.split("/")[0]
      return {
        folder: folder || dynamicFolder,
        resource_type: resourceType || dynamicResourceType,
        format: fileType === "image" ? "webp" : fileType === "video" ? "webm" : file.originalname.split(".").pop(), // Convert videos to WebM format
        transformation:
          fileType === "image"
            ? [{ format: "webp", quality: "auto" }]
            : fileType === "video"
            ? [{ format: "webm", quality: "auto" }]
            : [],
      }
    },
  })
}

// Create a dynamic storage instance
const dynamicStorage = createStorage()

// Middleware to handle file uploads
const uploadHandler = multer({ storage: dynamicStorage })

const uploadProfilePicture = multer({
  storage: createStorage("Profile_Pictures", "image", "webp", [
    { width: 500, height: 500, crop: "limit" },
    { quality: "auto" },
  ]),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
})

const deleteImage = async (req, res, next) => {
  try {
    if (req.user && req.user.profilePicture && req.user.profilePicture.publicId) {
      const publicId = req.user.profilePicture.publicId
      await cloudinary.uploader.destroy(publicId, { invalidate: true })
    }
    next()
  } catch (err) {
    next(err)
  }
}

export { uploadHandler, uploadProfilePicture, deleteImage }
