import { ERROR_MESSAGES, FILE_VALIDATION_RULES } from "../constants/constantValues"

const dataURItoBlob = (dataURI) => {
  const [header, base64Data] = dataURI.split(",")
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : ""
  const byteString = atob(base64Data)
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mime })
}

const validateSize = (file, maxSize, error) => {
  if (file.size > maxSize) {
    return { success: false, error }
  }
  return { success: true }
}

const validateDuration = (file, maxDuration, durationError, invalidError) => {
  const mediaElement = file.type.startsWith("video") ? document.createElement("video") : document.createElement("audio")

  return new Promise((resolve) => {
    mediaElement.preload = "metadata"
    mediaElement.onloadedmetadata = () => {
      URL.revokeObjectURL(mediaElement.src)
      if (mediaElement.duration > maxDuration) {
        resolve({ success: false, error: durationError })
      } else {
        resolve({ success: true })
      }
    }
    mediaElement.onerror = () => {
      URL.revokeObjectURL(mediaElement.src)
      resolve({ success: false, error: invalidError })
    }
    mediaElement.src = URL.createObjectURL(file)
  })
}

const validateFile = async (file) => {
  if (!file) {
    return { success: false, error: ERROR_MESSAGES.FILE_NOT_SPECIFIED }
  }

  let fileObj = file
  if (typeof file === "string" && file.startsWith("data:image")) {
    fileObj = dataURItoBlob(file)
  }

  const fileType = fileObj.type.split("/")[0]
  const rules = FILE_VALIDATION_RULES[fileType] || FILE_VALIDATION_RULES.default

  const sizeValidation = validateSize(file, rules.maxSize, `${rules.error || rules.sizeError} (File size: ${file.size})`)
  if (!sizeValidation.success) {
    return sizeValidation
  }

  if (rules.maxDuration) {
    return await validateDuration(file, rules.maxDuration, `${rules.durationError} (Duration exceeded)`, rules.invalidError)
  }

  return { success: true }
}

export default validateFile
