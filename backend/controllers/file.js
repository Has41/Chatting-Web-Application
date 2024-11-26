import errorHandler from "../utils/errorHandler.js"

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
    next(errorHandler(500, err.message))
  }
}

export { fileUploader }
