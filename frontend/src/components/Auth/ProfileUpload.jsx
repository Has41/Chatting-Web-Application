import React, { useState, useRef, useEffect } from "react"
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import setCanvasPreview from "../../utils/setCanvasPreview"
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"
import { useMutation } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { AUTH_PATHS } from "../../constants/apiPaths"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../Shared/LoadingSpinner"
import { ROOT_FOLDER } from "../../constants/constantValues"

const ProfileUpload = () => {
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [upImg, setUpImg] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [crop, setCrop] = useState(null)
  const imageRef = useRef(null)
  const fileInputRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const navigate = useNavigate()

  const { uploadFile } = useCloudinaryUpload()

  const { mutate } = useMutation({
    mutationFn: async (profileData) => {
      return await axiosInstance.post(AUTH_PATHS.SAVE_PROFILE_PIC, profileData)
    },
    onSuccess: (res) => {
      setIsLoading(false)
      console.log("Profile pic saved successfully!", res)
      localStorage.removeItem("currentForm")
      localStorage.removeItem("newUser")
      localStorage.removeItem("verificationEmail")
      navigate("/chat")
    },
    onError: (err) => {
      console.error("Error saving profile pic:", err)
      setIsLoading(false)
    }
  })

  const onSelectFile = (e) => {
    const file = e.target.files?.[0]

    if (!file) {
      console.error("No file selected!")
      return
    }

    if (!file.type.startsWith("image/")) {
      console.error("Selected file is not an image!")
      return
    }

    setCrop(null)
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

  const onImageLoaded = (e) => {
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

  const confirmCrop = () => {
    setCanvasPreview(
      imageRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height)
    )
    const dataUrl = previewCanvasRef.current.toDataURL()
    setProfilePhoto(dataUrl)
    setModalOpen(false)
  }

  const clearImage = () => {
    setProfilePhoto(null)
    setUpImg(null)
    setCrop(null)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCrop(null)
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

    const res = await uploadFile(profilePhoto, `${ROOT_FOLDER}/${userId}/profile-upload`, "image")

    if (res?.secure_url && res?.public_id) {
      mutate({ secure_url: res?.secure_url, public_id: res?.public_id, username })
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-sm rounded-lg bg-white p-6 font-poppins shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Elon Musk</h2>
          <p className="text-gray-500">@elonmusk</p>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="relative inline-block">
              <div className="size-72 overflow-hidden rounded-full border-2 border-slate-300">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Avatar Preview" className="size-full object-cover" />
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
              {profilePhoto && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={clearImage}
                  className="absolute right-10 top-2 z-50 mt-2 size-6 rounded-full bg-red-500 p-1 text-xs text-white hover:bg-red-600"
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
            className="w-full cursor-pointer rounded bg-button-color px-4 py-2 text-center font-semibold text-white shadow-md"
          >
            <LoadingSpinner loading={isLoading} loadingText="Please wait..." finalText="Confirm" size="size-5" />
          </button>
          {!profilePhoto && (
            <input ref={fileInputRef} type="file" id="avatar" className="hidden" onChange={onSelectFile} accept="image/*" />
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-[30%] space-y-4 rounded-lg bg-white p-4">
            <div className="flex items-center justify-between py-2">
              <h3 className="text-center font-mont text-xl font-semibold">Crop your photo</h3>
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
              className="w-full rounded bg-button-color px-4 py-2 text-lg font-semibold text-white"
            >
              Confirm Crop
            </button>
          </div>
        </div>
      )}
      {crop && <canvas ref={previewCanvasRef} className="hidden size-40 object-contain" />}
    </div>
  )
}

export default ProfileUpload
