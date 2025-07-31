import getFileType from "../../utils/getFileType"
import getPdfThumbnail from "../../utils/getPdfThumbnail"
import PDFMeta from "./PDFMeta"

const FileMessagePreview = ({ fileMeta, isSender }) => {
  const { mediaUrl, caption, publicId } = fileMeta
  const fileType = getFileType(mediaUrl)
  const thumbnailUrl = getPdfThumbnail(publicId)

  return (
    <div className="flex flex-col">
      {fileType === "image" && (
        <img src={mediaUrl} alt={caption || "Image"} className="max-h-60 max-w-full rounded object-contain" />
      )}

      {fileType === "video" && <video src={mediaUrl} controls className="max-h-60 w-full rounded-md" />}

      {fileType === "audio" && <audio src={mediaUrl} controls className="w-full" />}

      {fileType === "pdf" && (
        <div className="space-y-4">
          {/* <PDFPreview source={mediaUrl} width={200} /> */}
          <img
            src={thumbnailUrl}
            alt="PDF thumbnail"
            className="h-auto w-20 rounded border shadow"
            // onError={(e) => {
            //   // fallback if thumbnail fails
            //   e.currentTarget.src = "/pdf-icon.svg"
            // }}
          />

          <PDFMeta mediaUrl={mediaUrl} fileName={mediaUrl} />
        </div>
      )}

      {fileType === "archive" || fileType === "other" ? (
        <div className="flex flex-col items-center">
          <img src="/file-icon.svg" alt="File" className="mb-2 h-12 w-12" />
          <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">
            Download File
          </a>
        </div>
      ) : null}

      {caption && <p className={`ml-2 text-sm ${isSender ? "text-white" : "text-black/80"} py-2`}>{caption}</p>}
    </div>
  )
}

export default FileMessagePreview
