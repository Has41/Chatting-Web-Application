const getPdfThumbnail = (publicId, width = 300) => {
  return `https://res.cloudinary.com/${import.meta.env.VITE_API_CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/pg_1/${publicId}`
}

export default getPdfThumbnail
