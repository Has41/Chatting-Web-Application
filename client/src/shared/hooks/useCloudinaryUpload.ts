import { useState, useCallback } from "react"
import axios from "axios"
import axiosInstance from "@shared/api/api-client"
import { FILE_PATHS } from "@shared/constants/apiPaths"
import validateFile from "@shared/utils/validateFile"

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

interface UploadResult {
  public_id: string
  secure_url: string
  format: string
  eager?: Array<{ secure_url?: string }>
  width?: number
  height?: number
}

interface SignatureResult {
  signature: string
  timestamp: number
  public_id: string
  folder: string
  apiKey: string
  cloudName: string
  format?: string
  transformation?: string
  eager?: string
  resource_type?: string
}

const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File, folder: string, mimeType: string, uploadType: string): Promise<UploadResult | null> => {
    setUploading(true)
    setProgress(null)
    setError(null)

    try {
      const validationResult = await validateFile(file)

      if (!validationResult.success) {
        setError(validationResult.error || "Invalid file")
        return null
      }

      const { data: signedData } = await axiosInstance.post<SignatureResult>(FILE_PATHS.GENERATE_SIGNATURE, {
        folder,
        uploadType,
        mimeType
      })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", signedData.apiKey)
      formData.append("timestamp", String(signedData.timestamp))
      formData.append("signature", signedData.signature)
      formData.append("public_id", signedData.public_id)
      formData.append("folder", signedData.folder)

      if (signedData.eager) formData.append("eager", signedData.eager)
      if (signedData.transformation) formData.append("transformation", signedData.transformation)
      if (signedData.format) formData.append("format", signedData.format)

      const cloudName = signedData.cloudName
      const resourceType = signedData.resource_type || "auto"

      if (!cloudName) {
        throw new Error("Cloudinary cloud name is missing from the upload signature")
      }

      const response = await axios.post<UploadResult>(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
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
      if (import.meta.env.DEV) {
        console.error("Cloudinary upload failed:", err)
      }
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
    uploadFile: upload,
    uploading,
    isUploading: uploading,
    progress,
    error,
    uploadedFileUrl: null,
    reset
  }
}

export default useCloudinaryUpload
