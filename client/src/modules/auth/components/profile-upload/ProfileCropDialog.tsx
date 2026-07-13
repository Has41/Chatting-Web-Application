import type { RefObject, SyntheticEvent } from "react"
import ReactCrop, { type Crop } from "react-image-crop"

interface ProfileCropDialogProps {
  crop: Crop | undefined
  imageRef: RefObject<HTMLImageElement | null>
  imageSource: string | null
  onChangeCrop: (crop: Crop) => void
  onClose: () => void
  onConfirmCrop: () => void
  onImageLoaded: (event: SyntheticEvent<HTMLImageElement>) => void
}

const ProfileCropDialog = ({
  crop,
  imageRef,
  imageSource,
  onChangeCrop,
  onClose,
  onConfirmCrop,
  onImageLoaded
}: ProfileCropDialogProps) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-[30%] space-y-4 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between py-2">
          <h3 className="font-mont text-center text-xl font-semibold">Crop your photo</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-6 items-center justify-center"
            aria-label="Close crop dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {imageSource && (
          <ReactCrop crop={crop} onChange={onChangeCrop} circularCrop keepSelection aspect={1} minWidth={150}>
            <img ref={imageRef} src={imageSource} onLoad={onImageLoaded} alt="Crop me" />
          </ReactCrop>
        )}
        <button
          type="button"
          onClick={onConfirmCrop}
          className="bg-button-color w-full rounded px-4 py-2 text-lg font-semibold text-white"
        >
          Confirm Crop
        </button>
      </div>
    </div>
  )
}

export default ProfileCropDialog
