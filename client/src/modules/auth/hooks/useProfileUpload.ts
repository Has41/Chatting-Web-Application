import { useReducer, useRef, type ChangeEvent, type SyntheticEvent } from "react"
import { convertToPixelCrop, type Crop } from "react-image-crop"
import { useNavigate } from "react-router-dom"
import useCloudinaryUpload from "@shared/hooks/useCloudinaryUpload"
import { ROOT_FOLDER } from "@shared/constants/constantValues"
import { useSaveProfilePictureMutation } from "@auth/queries/authQueries"
import { createCroppedProfileImage } from "@auth/utils/createCroppedProfileImage"
import { clearOnboardingStorage, createCenteredProfileCrop, isImageFile, readFileAsDataUrl } from "@auth/utils/profileUpload"
import { initialProfileUploadState, profileUploadReducer } from "@auth/states/profileUploadState"
import type { SaveProfilePictureResponse } from "@auth/types/profileUpload"

export const useProfileUpload = () => {
  const [state, dispatch] = useReducer(profileUploadReducer, initialProfileUploadState)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const profilePhotoRef = useRef<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const navigate = useNavigate()

  const { uploadFile } = useCloudinaryUpload()
  const saveProfilePictureMutation = useSaveProfilePictureMutation()

  const onSelectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      console.error("No file selected!")
      return
    }

    if (!isImageFile(file)) {
      console.error("Selected file is not an image!")
      return
    }

    dispatch({ type: "fileReadStarted" })
    imageRef.current = null

    const imageUrl = await readFileAsDataUrl(file)
    dispatch({ type: "fileReadSucceeded", imageUrl })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onImageLoaded = (event: SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = event.currentTarget
    dispatch({ type: "cropChanged", crop: createCenteredProfileCrop(event.currentTarget) })
  }

  const confirmCrop = async () => {
    if (!state.crop || !imageRef.current || !previewCanvasRef.current) return

    const pixelCrop = convertToPixelCrop(state.crop, imageRef.current.width, imageRef.current.height)
    const croppedProfileImage = await createCroppedProfileImage(imageRef.current, previewCanvasRef.current, pixelCrop)

    if (!croppedProfileImage) return

    profilePhotoRef.current = croppedProfileImage.file
    dispatch({ type: "cropConfirmed", dataUrl: croppedProfileImage.dataUrl })
  }

  const clearImage = () => {
    profilePhotoRef.current = null
    dispatch({ type: "imageCleared" })
  }

  const closeModal = () => {
    imageRef.current = null
    dispatch({ type: "modalClosed" })
  }

  const confirmUpload = async () => {
    dispatch({ type: "uploadStarted" })

    if (!profilePhotoRef.current) {
      dispatch({ type: "uploadFinished" })
      return
    }

    const username = localStorage.getItem("newUser")
    const userId = localStorage.getItem("userId")
    const profilePhoto = profilePhotoRef.current
    const response = await uploadFile(profilePhoto, `${ROOT_FOLDER}/${userId}/profile-upload`, profilePhoto.type, "image")

    if (!response?.secure_url || !response?.public_id) {
      dispatch({ type: "uploadFinished" })
      return
    }

    saveProfilePictureMutation.mutate(
      { secure_url: response.secure_url, public_id: response.public_id, username },
      {
        onSuccess: (result: SaveProfilePictureResponse) => {
          dispatch({ type: "uploadFinished" })
          console.log("Profile pic saved successfully!", result)
          clearOnboardingStorage()
          navigate("/chat")
        },
        onError: (error: unknown) => {
          dispatch({ type: "uploadFinished" })
          if (import.meta.env.PROD) return
          console.error("Error saving profile pic:", error)
        }
      }
    )
  }

  return {
    state,
    fileInputRef,
    imageRef,
    previewCanvasRef,
    handlers: {
      clearImage,
      closeModal,
      confirmCrop,
      confirmUpload,
      onImageLoaded,
      onSelectFile,
      setCrop: (crop: Crop | undefined) => dispatch({ type: "cropChanged", crop })
    }
  }
}
