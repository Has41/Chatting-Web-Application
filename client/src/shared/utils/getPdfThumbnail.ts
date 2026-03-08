const getPdfThumbnail = (publicId: string, width: number = 300): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "demo"
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},c_fit,pg_1/${publicId}.png`
}

export default getPdfThumbnail
