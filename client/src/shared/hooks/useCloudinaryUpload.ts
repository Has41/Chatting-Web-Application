import { useState, useCallback } from "react"
import axios from "axios"

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "demo"
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset"

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

interface UploadResult {
  public_id: string
  secure_url: string
  format: string
  width?: number
  height?: number
}

const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File): Promise<UploadResult | null> => {
    setUploading(true)
    setProgress(null)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    try {
      const response = await axios.post<UploadResult>(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const loaded = progressEvent.loaded
            const total = progressEvent.total || 0
            const percentage = Math.round((loaded * 100) / total)
            setProgress({ loaded, total, percentage })
          }
        }
      )

      setUploading(false)
      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setError(message)
      setUploading(false)
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setUploading(false)
    setProgress(null)
    setError(null)
  }, [])

  return {
    upload,
    uploading,
    progress,
    error,
    reset
  }
}

export default useCloudinaryUpload
