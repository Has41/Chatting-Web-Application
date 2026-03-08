import { ERROR_MESSAGES, FILE_VALIDATION_RULES } from "@shared/constants/constantValues"

interface ValidationResult {
  success: boolean
  error?: string
}

interface FileValidationRule {
  maxSize: number
  error?: string
  maxDuration?: number
  sizeError?: string
  durationError?: string
  invalidError?: string
}

const dataURItoBlob = (dataURI: string): Blob => {
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

const validateSize = (file: File, maxSize: number, error: string): ValidationResult => {
  if (file.size > maxSize) {
    return { success: false, error }
  }
  return { success: true }
}

const validateDuration = (
  file: File,
  maxDuration: number,
  durationError: string,
  invalidError: string
): Promise<ValidationResult> => {
  const fileType = file.type.split("/")[0]
  const mediaElement = fileType === "video" ? document.createElement("video") : document.createElement("audio")

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

const validateFile = async (file: File | string): Promise<ValidationResult> => {
  if (!file) {
    return { success: false, error: ERROR_MESSAGES.FILE_NOT_SPECIFIED }
  }

  let fileObj: Blob | File = file as File
  if (typeof file === "string" && file.startsWith("data:image")) {
    fileObj = dataURItoBlob(file)
  }

  const fileType = fileObj.type.split("/")[0]
  const rules: FileValidationRule =
    FILE_VALIDATION_RULES[fileType as keyof typeof FILE_VALIDATION_RULES] || FILE_VALIDATION_RULES.default

  const errorMessage = rules.error || rules.sizeError || "File size too large"
  const sizeValidation = validateSize(file as File, rules.maxSize, `${errorMessage} (File size: ${(file as File).size})`)
  if (!sizeValidation.success) {
    return sizeValidation
  }

  if (rules.maxDuration) {
    return await validateDuration(
      file as File,
      rules.maxDuration,
      `${rules.durationError} (Duration exceeded)`,
      rules.invalidError || ""
    )
  }

  return { success: true }
}

export default validateFile
