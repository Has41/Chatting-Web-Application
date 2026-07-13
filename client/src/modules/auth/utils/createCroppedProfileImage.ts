import type { PixelCrop } from "react-image-crop"

interface CroppedProfileImage {
  dataUrl: string
  file: File
}

const drawCroppedImage = (image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop): void => {
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("No 2d context")
  }

  const pixelRatio = window.devicePixelRatio
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = "high"
  ctx.save()

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  ctx.translate(-cropX, -cropY)
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)
  ctx.restore()
}

const getCanvasBlob = async (canvas: HTMLCanvasElement): Promise<Blob | null> => {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
}

export const createCroppedProfileImage = async (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop
): Promise<CroppedProfileImage | null> => {
  drawCroppedImage(image, canvas, crop)

  const dataUrl = canvas.toDataURL("image/png")
  const blob = await getCanvasBlob(canvas)

  if (!blob) return null

  return {
    dataUrl,
    file: new File([blob], "profile.png", { type: "image/png" })
  }
}
