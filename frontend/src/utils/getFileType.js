const getFileType = (fileUrl) => {
  const extension = fileUrl.split(".").pop().toLowerCase()

  switch (extension) {
    // Images
    case "jpeg":
    case "jpg":
    case "gif":
    case "png":
    case "webp":
      return "image"

    // Videos
    case "mp4":
    case "webm":
    case "ogg":
      return "video"

    // Audio
    case "mp3":
    case "wav":
    case "webm":
    case "mpeg":
      return "audio"

    // Documents
    case "pdf":
      return "pdf"

    case "doc":
    case "docx":
      return "word"

    case "xls":
    case "xlsx":
      return "excel"

    case "ppt":
    case "pptx":
      return "powerpoint"

    // Archives
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "archive"

    // Text & Data
    case "txt":
    case "csv":
    case "json":
    case "xml":
    case "html":
      return "text"

    // Code files
    case "js":
    case "mjs":
    case "ts":
    case "tsx":
    case "py":
    case "java":
    case "c":
    case "cpp":
    case "yml":
    case "yaml":
    case "sh":
    case "php":
      return "code"

    default:
      return "other"
  }
}

export default getFileType
