import { centerCrop, makeAspectCrop } from "react-image-crop"

export const isImageFile = (file: File): boolean => file.type.startsWith("image/")

export const readFileAsDataUrl = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result?.toString() || "")
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export const createCenteredProfileCrop = (image: HTMLImageElement, minWidth = 150) => {
  const { width, height } = image
  const cropWidthInPercent = (minWidth / width) * 100

  const cropConfig = makeAspectCrop(
    {
      unit: "%",
      width: cropWidthInPercent
    },
    1,
    width,
    height
  )

  return centerCrop(cropConfig, width, height)
}

export const clearOnboardingStorage = () => {
  localStorage.removeItem("currentForm")
  localStorage.removeItem("newUser")
  localStorage.removeItem("verificationEmail")
}
