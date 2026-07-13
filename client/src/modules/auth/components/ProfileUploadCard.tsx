import type { ChangeEvent, RefObject } from "react"
import LoadingSpinner from "@shared/components/LoadingSpinner"
import ProfileImagePicker from "./ProfileImagePicker"

interface ProfileUploadCardProps {
  fileInputRef: RefObject<HTMLInputElement | null>
  isLoading: boolean
  profilePreview: string | null
  onClearImage: () => void
  onConfirmUpload: () => void
  onSelectFile: (event: ChangeEvent<HTMLInputElement>) => void
}

const ProfileUploadCard = ({
  fileInputRef,
  isLoading,
  profilePreview,
  onClearImage,
  onConfirmUpload,
  onSelectFile
}: ProfileUploadCardProps) => {
  return (
    <div className="font-poppins mx-auto max-w-sm rounded-lg bg-white p-6 shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Elon Musk</h2>
        <p className="text-gray-500">@elonmusk</p>
      </div>

      <ProfileImagePicker
        fileInputRef={fileInputRef}
        profilePreview={profilePreview}
        onClearImage={onClearImage}
        onSelectFile={onSelectFile}
      />

      <div className="mt-6">
        <button
          type="button"
          onClick={onConfirmUpload}
          className="bg-button-color w-full cursor-pointer rounded px-4 py-2 text-center font-semibold text-white shadow-md"
        >
          <LoadingSpinner loading={isLoading} loadingText="Please wait..." finalText="Confirm" size="size-5" />
        </button>
      </div>
    </div>
  )
}

export default ProfileUploadCard
