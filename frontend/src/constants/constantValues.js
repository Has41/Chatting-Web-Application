const ROOT_FOLDER = "My-Chatting-App"
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 30 * 1024 * 1024
const MAX_AUDIO_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_DURATION = 5 * 60
const MAX_AUDIO_DURATION = 2 * 60
const MAX_OTHER_FILE_SIZE = 50 * 1024 * 1024

const ERROR_MESSAGES = {
  FILE_NOT_SPECIFIED: "File must be specified!",
  IMAGE_TOO_LARGE: "Image size is too large! Max size is 5MB",
  VIDEO_TOO_LARGE: "Video size is too large! Max size is 30MB",
  VIDEO_TOO_LONG: "Video length is too long! Max length is 5 minutes",
  AUDIO_TOO_LARGE: "Audio size is too large! Max size is 10MB",
  AUDIO_TOO_LONG: "Audio length is too long! Max length is 2 minutes",
  INVALID_VIDEO: "Invalid video file",
  INVALID_AUDIO: "Invalid audio file"
}

const FILE_VALIDATION_RULES = {
  image: {
    maxSize: MAX_IMAGE_SIZE,
    error: ERROR_MESSAGES.IMAGE_TOO_LARGE
  },
  video: {
    maxSize: MAX_VIDEO_SIZE,
    maxDuration: MAX_VIDEO_DURATION,
    sizeError: ERROR_MESSAGES.VIDEO_TOO_LARGE,
    durationError: ERROR_MESSAGES.VIDEO_TOO_LONG,
    invalidError: ERROR_MESSAGES.INVALID_VIDEO
  },
  audio: {
    maxSize: MAX_AUDIO_SIZE,
    maxDuration: MAX_AUDIO_DURATION,
    sizeError: ERROR_MESSAGES.AUDIO_TOO_LARGE,
    durationError: ERROR_MESSAGES.AUDIO_TOO_LONG,
    invalidError: ERROR_MESSAGES.INVALID_AUDIO
  },
  default: {
    maxSize: MAX_OTHER_FILE_SIZE,
    error: ERROR_MESSAGES.OTHER_FILE_TOO_LARGE
  }
}

export {
  ROOT_FOLDER,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  MAX_AUDIO_SIZE,
  MAX_VIDEO_DURATION,
  MAX_AUDIO_DURATION,
  MAX_OTHER_FILE_SIZE,
  ERROR_MESSAGES,
  FILE_VALIDATION_RULES
}
