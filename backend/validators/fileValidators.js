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
        // Images
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",

        // Videos
        "video/mp4",
        "video/webm",

        // Audio
        "audio/webm",
        "audio/mpeg",
        "audio/mp3",

        // Documents
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        "application/vnd.ms-powerpoint", // .ppt

        // Archives
        "application/zip",
        "application/x-7z-compressed",
        "application/x-rar-compressed",
        "application/gzip",
        "application/x-tar",

        // Text & Data
        "text/plain", // .txt
        "text/csv", // .csv
        "application/json", // .json
        "application/xml", // .xml
        "text/html", // .html
        "application/javascript", // .js
        "text/javascript", // .mjs
        "application/typescript", // .ts
        "text/x-typescript", // .tsx

        // Source Code
        "text/x-python", // .py
        "text/x-java-source", // .java
        "text/x-c", // .c
        "text/x-c++src", // .cpp
        "application/x-yaml", // .yaml / .yml
        "application/x-sh", // .sh
        "application/x-httpd-php", // .php
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
