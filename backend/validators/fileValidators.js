import { param, body } from "express-validator"

const validateFileIds = [
  param("publicId").notEmpty().withMessage("Public Id required!"),
  param("messageId").isMongoId().withMessage("Must be a valid mongo Id"),
]

const validateSignatureBody = [
  body("folder").notEmpty().withMessage("Folder path required!").isString().withMessage("Folder must be a string"),

  body("mimeType")
    .notEmpty()
    .withMessage("File MIME type required!")
    .isString()
    .withMessage("MIME type must be a string")
    .custom((value) => {
      const allowedMimeTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "video/mp4",
        "video/webm",
        "audio/mpeg",
        "audio/mp3",
        "application/pdf",
      ]
      if (!allowedMimeTypes.includes(value)) {
        throw new Error("Invalid MIME type")
      }
      return true
    }),

  body("uploadType")
    .optional()
    .isIn(["image", "video", "document", "audio"])
    .withMessage("uploadType must be one of: image, video, document, audio"),
]

export { validateFileIds, validateSignatureBody }
