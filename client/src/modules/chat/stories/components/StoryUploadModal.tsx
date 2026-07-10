import { useRef, useState, type ChangeEvent } from "react"
import { ImagePlus, Loader2, Send, X } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCloudinaryUpload from "@shared/hooks/useCloudinaryUpload"
import { ROOT_FOLDER } from "@shared/constants/constantValues"
import { STORY_PATHS } from "@shared/constants/apiPaths"
import axiosInstance from "@shared/utils/axiosInstance"

interface StoryUploadModalProps {
  onClose: () => void
}

const StoryUploadModal = ({ onClose }: StoryUploadModalProps) => {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [caption, setCaption] = useState("")
  const { upload, uploading, progress, error } = useCloudinaryUpload()

  const createStoryMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose an image or video first")

      const mediaType = file.type.startsWith("video/") ? "video" : "image"
      const uploadResult = await upload(file, `${ROOT_FOLDER}/stories`, file.type, "status")

      if (!uploadResult?.secure_url) {
        throw new Error("Story upload failed")
      }

      const response = await axiosInstance.post(STORY_PATHS.CREATE, {
        mediaUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        mediaType,
        mimeType: file.type,
        caption: caption.trim()
      })

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] })
      onClose()
    }
  })

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
      event.target.value = ""
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    event.target.value = ""
  }

  const isSubmitting = uploading || createStoryMutation.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <h2 className="text-base font-semibold text-slate-900">Create story</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto p-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-52 w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-50 transition hover:bg-slate-100"
          >
            {previewUrl && file?.type.startsWith("image/") ? (
              <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            ) : previewUrl && file?.type.startsWith("video/") ? (
              <video src={previewUrl} className="h-full w-full object-cover" muted controls />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <ImagePlus className="size-9" />
                <span className="text-sm font-medium">Choose image or video</span>
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Add a caption..."
            className="h-16 w-full resize-none rounded-md border border-slate-200 p-3 text-sm outline-none transition focus:border-slate-400"
            maxLength={160}
          />

          {(error || createStoryMutation.error) && (
            <p className="text-sm text-red-500">
              {error || (createStoryMutation.error instanceof Error ? createStoryMutation.error.message : "Unable to upload story")}
            </p>
          )}

          {progress && isSubmitting && (
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress.percentage}%` }} />
            </div>
          )}

          <button
            type="button"
            onClick={() => createStoryMutation.mutate()}
            disabled={!file || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {isSubmitting ? "Uploading..." : "Post story"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoryUploadModal
