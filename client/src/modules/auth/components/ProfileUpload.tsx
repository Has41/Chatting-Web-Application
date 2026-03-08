import { useState, useRef, type ChangeEvent, type SyntheticEvent } from "react"
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import setCanvasPreview from "@shared/utils/setCanvasPreview"
import useCloudinaryUpload from "@shared/hooks/useCloudinaryUpload"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@shared/utils/axiosInstance"
import { AUTH_PATHS } from "@shared/constants/apiPaths"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "@shared/components/LoadingSpinner"
import { ROOT_FOLDER } from "@shared/constants/constantValues"

const ProfileUpload = () => {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [upImg, setUpImg] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [crop, setCrop] = useState<Crop | undefined>(undefined)
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const navigate = useNavigate()

  const { uploadFile } = useCloudinaryUpload()

  const { mutate } = useMutation({
    mutationFn: async (profileData: { secure_url: string; public_id: string; username: string | null }) => {
      return await axiosInstance.post(AUTH_PATHS.SAVE_PROFILE_PIC, profileData)
    },
    onSuccess: (res: unknown) => {
      setIsLoading(false)
      console.log("Profile pic saved successfully!", res)
      localStorage.removeItem("currentForm")
      localStorage.removeItem("newUser")
      localStorage.removeItem("verificationEmail")
      navigate("/chat")
    },
    onError: (err: unknown) => {
      if (import.meta.env.PROD) return
      console.error("Error saving profile pic:", err)
      setIsLoading(false)
    }
  })

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      console.error("No file selected!")
      return
    }

    if (!file.type.startsWith("image/")) {
      console.error("Selected file is not an image!")
      return
    }

    setCrop(undefined)
    imageRef.current = null
    setUpImg(null)

    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || ""
      setUpImg(imageUrl)
    })
    reader.readAsDataURL(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setModalOpen(true)
  }

  const onImageLoaded = (e: SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget
    const { width, height } = e.currentTarget
    const cropWidthInPercent = (150 / width) * 100

    const cropConfig = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent
      },
      1,
      width,
      height
    )
    const centeredCrop = centerCrop(cropConfig, width, height)
    setCrop(centeredCrop)
  }

  const confirmCrop = async () => {
    if (!crop || !imageRef.current || !previewCanvasRef.current) return

    const pixelCrop = convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height)
    setCompletedCrop(pixelCrop)
    setCanvasPreview(imageRef.current, previewCanvasRef.current, pixelCrop)
    const dataUrl = previewCanvasRef.current.toDataURL("image/png")
    setProfilePreview(dataUrl)
    const blob = previewCanvasRef.current.toBlob
      ? await new Promise<Blob | null>((resolve) => previewCanvasRef.current?.toBlob(resolve, "image/png"))
      : null
    if (blob) {
      setProfilePhoto(new File([blob], "profile.png", { type: "image/png" }))
    }
    setModalOpen(false)
  }

  const clearImage = () => {
    setProfilePhoto(null)
    setProfilePreview(null)
    setUpImg(null)
    setCrop(undefined)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCrop(undefined)
    setUpImg(null)
    imageRef.current = null
  }

  const confirmUpload = async () => {
    setIsLoading(true)
    if (!profilePhoto) {
      setIsLoading(false)
      return
    }
    const username = localStorage.getItem("newUser")
    const userId = localStorage.getItem("userId")

    const res = await uploadFile(profilePhoto, `${ROOT_FOLDER}/${userId}/profile-upload`, profilePhoto.type, "image")

    if (res?.secure_url && res?.public_id) {
      mutate({ secure_url: res?.secure_url, public_id: res?.public_id, username })
    }
  }

  return (
    <div>
      <div className="font-poppins mx-auto max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Elon Musk</h2>
          <p className="text-gray-500">@elonmusk</p>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="relative inline-block">
              <div className="size-72 overflow-hidden rounded-full border-2 border-slate-300">
                {profilePreview ? (
                  <img src={profilePreview} alt="Avatar Preview" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                      />
                    </svg>
                    <span className="mt-2 text-sm">Upload Photo</span>
                  </div>
                )}
              </div>
              {profilePreview && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={clearImage}
                  className="absolute top-2 right-10 z-50 mt-2 size-6 rounded-full bg-red-500 p-1 text-xs text-white hover:bg-red-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </label>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={confirmUpload}
            className="bg-button-color w-full cursor-pointer rounded px-4 py-2 text-center font-semibold text-white shadow-md"
          >
            <LoadingSpinner loading={isLoading} loadingText="Please wait..." finalText="Confirm" size="size-5" />
          </button>
          {!profilePreview && (
            <input ref={fileInputRef} type="file" id="avatar" className="hidden" onChange={onSelectFile} accept="image/*" />
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-[30%] space-y-4 rounded-lg bg-white p-4">
            <div className="flex items-center justify-between py-2">
              <h3 className="font-mont text-center text-xl font-semibold">Crop your photo</h3>
              <svg
                onClick={closeModal}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-pointer"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            {upImg && (
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                circularCrop
                keepSelection
                aspect={1}
                minWidth={150}
              >
                <img ref={imageRef} src={upImg} onLoad={onImageLoaded} alt="Crop me" />
              </ReactCrop>
            )}
            <button
              onClick={confirmCrop}
              className="bg-button-color w-full rounded px-4 py-2 text-lg font-semibold text-white"
            >
              Confirm Crop
            </button>
          </div>
        </div>
      )}
      {(crop || completedCrop) && <canvas ref={previewCanvasRef} className="hidden size-40 object-contain" />}
    </div>
  )
}

export default ProfileUpload
