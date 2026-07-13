import type { Crop } from "react-image-crop"

export interface ProfileUploadState {
  crop: Crop | undefined
  isLoading: boolean
  modalOpen: boolean
  profilePreview: string | null
  upImg: string | null
}

export type ProfileUploadAction =
  | { type: "fileReadStarted" }
  | { type: "fileReadSucceeded"; imageUrl: string }
  | { type: "cropChanged"; crop: Crop | undefined }
  | { type: "cropConfirmed"; dataUrl: string }
  | { type: "modalClosed" }
  | { type: "imageCleared" }
  | { type: "uploadStarted" }
  | { type: "uploadFinished" }

export const initialProfileUploadState: ProfileUploadState = {
  crop: undefined,
  isLoading: false,
  modalOpen: false,
  profilePreview: null,
  upImg: null
}

export const profileUploadReducer = (state: ProfileUploadState, action: ProfileUploadAction): ProfileUploadState => {
  switch (action.type) {
    case "fileReadStarted":
      return { ...state, crop: undefined, upImg: null }
    case "fileReadSucceeded":
      return { ...state, modalOpen: true, upImg: action.imageUrl }
    case "cropChanged":
      return { ...state, crop: action.crop }
    case "cropConfirmed":
      return { ...state, modalOpen: false, profilePreview: action.dataUrl }
    case "modalClosed":
      return { ...state, crop: undefined, modalOpen: false, upImg: null }
    case "imageCleared":
      return { ...state, crop: undefined, profilePreview: null, upImg: null }
    case "uploadStarted":
      return { ...state, isLoading: true }
    case "uploadFinished":
      return { ...state, isLoading: false }
    default:
      return state
  }
}
