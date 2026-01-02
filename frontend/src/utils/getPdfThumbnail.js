const getPdfThumbnail = (publicId, width = 300) => {
  return `https://res.cloudinary.com/${import.meta.env.VITE_API_CLOUD_NAME}/image/upload/w_${width},c_fit,pg_1/${publicId}.png`
}

export default getPdfThumbnail
