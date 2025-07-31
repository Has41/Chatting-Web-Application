import { useState } from "react"
import { useMutation } from "react-query"
import { FILE_PATHS } from "../constants/apiPaths"
import axiosInstance from "../utils/axiosInstance"
import axios from "axios"
import validateFile from "../utils/validateFile"

const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null)
  const [uploadedPublicId, setUploadedPublicId] = useState(null)
  const cloudName = import.meta.env.VITE_API_CLOUD_NAME

  const { mutateAsync: generateSignature } = useMutation({
    mutationFn: async ({ folder, mimeType, uploadType }) => {
      const { data } = await axiosInstance.post(FILE_PATHS.GENERATE_SIGNATURE, { folder, uploadType, mimeType })
      return data
    }
  })

  const { mutateAsync: uploadToCloudinaryApi } = useMutation({
    mutationFn: async ({ formData, resourceType }) => {
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, formData)
      return data
    },
    onSuccess: (data) => {
      setUploadedFileUrl(data.secure_url)
      setUploadedPublicId(data.public_id)
    },
    onError: (err) => {
      setError(err.message || "An error occurred during upload")
      if (import.meta.env.PROD) return
      console.error("Error uploading file:", err)
    }
  })

  const uploadFile = async (file, folder, mimeType, uploadType) => {
    if (!file) {
      console.error("File must be specified!")
      return
    }
    setIsUploading(true)

    try {
      const validationResult = await validateFile(file)

      if (!validationResult.success) {
        setError(validationResult.error)
        return
      }
      const signedData = await generateSignature({ folder, mimeType, uploadType })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", signedData.apiKey)
      formData.append("timestamp", signedData.timestamp)
      formData.append("signature", signedData.signature)
      formData.append("public_id", signedData.public_id)
      formData.append("folder", folder)
      console.log(signedData)

      if (signedData.eager) formData.append("eager", signedData.eager)
      if (signedData.transformation) formData.append("transformation", signedData.transformation)
      if (signedData.format) formData.append("format", signedData.format)
      if (signedData.resource_type) formData.append("resource_type", signedData.resource_type)

      const resourceType = signedData.resource_type || "auto"

      const res = await uploadToCloudinaryApi({ formData, resourceType })
      return res
    } catch (err) {
      setError(err.message || "An error occurred during upload")
      if (import.meta.env.PROD) return
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadFile, isUploading, error, uploadedFileUrl, uploadedPublicId }
}

export default useCloudinaryUpload
