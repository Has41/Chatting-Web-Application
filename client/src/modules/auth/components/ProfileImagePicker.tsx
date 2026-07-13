import type { ChangeEvent, RefObject } from "react"

interface ProfileImagePickerProps {
  fileInputRef: RefObject<HTMLInputElement | null>
  profilePreview: string | null
  onSelectFile: (event: ChangeEvent<HTMLInputElement>) => void
  onClearImage: () => void
}

const ProfileImagePicker = ({ fileInputRef, profilePreview, onSelectFile, onClearImage }: ProfileImagePickerProps) => {
  return (
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
            <button
              type="button"
              onClick={onClearImage}
              className="absolute top-2 right-10 z-50 mt-2 inline-flex size-6 items-center justify-center rounded-full bg-red-500 p-1 text-xs text-white hover:bg-red-600"
              aria-label="Remove selected profile photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-full"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </label>
      {!profilePreview && (
        <input ref={fileInputRef} type="file" id="avatar" className="hidden" onChange={onSelectFile} accept="image/*" />
      )}
    </div>
  )
}

export default ProfileImagePicker
