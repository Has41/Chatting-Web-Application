import { ERROR_MESSAGES, FILE_VALIDATION_RULES } from "../constants/constantValues"

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

  const fileType = file.type.split("/")[0]
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
