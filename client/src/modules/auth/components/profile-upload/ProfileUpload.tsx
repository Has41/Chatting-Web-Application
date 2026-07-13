import "react-image-crop/dist/ReactCrop.css"
import { useProfileUpload } from "@auth/hooks/useProfileUpload"
import ProfileCropDialog from "./ProfileCropDialog"
import ProfileUploadCard from "./ProfileUploadCard"

const ProfileUpload = () => {
  const { state, fileInputRef, imageRef, previewCanvasRef, handlers } = useProfileUpload()

  return (
    <div>
      <ProfileUploadCard
        fileInputRef={fileInputRef}
        isLoading={state.isLoading}
        profilePreview={state.profilePreview}
        onClearImage={handlers.clearImage}
        onConfirmUpload={handlers.confirmUpload}
        onSelectFile={handlers.onSelectFile}
      />

      {state.modalOpen && (
        <ProfileCropDialog
          crop={state.crop}
          imageRef={imageRef}
          imageSource={state.upImg}
          onChangeCrop={handlers.setCrop}
          onClose={handlers.closeModal}
          onConfirmCrop={handlers.confirmCrop}
          onImageLoaded={handlers.onImageLoaded}
        />
      )}
      {state.crop && <canvas ref={previewCanvasRef} className="hidden size-40 object-contain" />}
    </div>
  )
}

export default ProfileUpload
