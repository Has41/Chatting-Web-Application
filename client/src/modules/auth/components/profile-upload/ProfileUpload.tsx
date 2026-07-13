import "react-image-crop/dist/ReactCrop.css"
import { useProfileUpload } from "@auth/hooks/useProfileUpload"
import ProfileCropDialog from "./ProfileCropDialog"
import ProfileUploadCard from "./ProfileUploadCard"

const ProfileUpload = () => {
  const profileUpload = useProfileUpload()

  return (
    <div>
      <ProfileUploadCard
        fileInputRef={profileUpload.refs.fileInputRef}
        isLoading={profileUpload.state.isLoading}
        profilePreview={profileUpload.state.profilePreview}
        onClearImage={profileUpload.handlers.clearImage}
        onConfirmUpload={profileUpload.handlers.confirmUpload}
        onSelectFile={profileUpload.handlers.onSelectFile}
      />

      {profileUpload.state.modalOpen && (
        <ProfileCropDialog
          crop={profileUpload.state.crop}
          imageRef={profileUpload.refs.imageRef}
          imageSource={profileUpload.state.upImg}
          onChangeCrop={profileUpload.handlers.setCrop}
          onClose={profileUpload.handlers.closeModal}
          onConfirmCrop={profileUpload.handlers.confirmCrop}
          onImageLoaded={profileUpload.handlers.onImageLoaded}
        />
      )}
      {profileUpload.state.crop && (
        <canvas ref={profileUpload.refs.previewCanvasRef} className="hidden size-40 object-contain" />
      )}
    </div>
  )
}

export default ProfileUpload
