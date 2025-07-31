const getFileType = (fileUrl) => {
  const extension = fileUrl.split(".").pop().toLowerCase()

  switch (extension) {
    case "jpeg":
    case "jpg":
    case "gif":
    case "png":
    case "webp":
      return "image"

    case "mp4":
    case "webm":
    case "ogg":
      return "video"

    case "mp3":
    case "wav":
      return "audio"

    case "pdf":
      return "pdf"

    case "zip":
    case "rar":
    case "7z":
      return "archive"

    default:
      return "other"
  }
}

export default getFileType
