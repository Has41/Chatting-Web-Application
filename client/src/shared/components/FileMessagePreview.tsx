import getFileType from "@shared/utils/getFileType"
import PDFMeta from "./PDFMeta"

const FileMessagePreview = ({ fileMeta, isSender }) => {
  const { mediaUrl, caption } = fileMeta
  const fileType = getFileType(mediaUrl)

  return (
    <div className="flex flex-col">
      {fileType === "image" && (
        <img src={mediaUrl} alt={caption || "Image"} className="max-h-60 max-w-full rounded object-contain" />
      )}

      {fileType === "video" && <video src={mediaUrl} controls className="max-h-60 w-full rounded-md" />}

      {fileType === "audio" && <audio src={mediaUrl} controls className="max-w-full" />}

      {fileType === "pdf" && (
        <div className="">
          <img src={fileMeta?.thumbnailUrl} alt="PDF thumbnail" className="h-48 w-full rounded border shadow" />
          <PDFMeta mediaUrl={mediaUrl} fileName={mediaUrl} />
        </div>
      )}

      {fileType === "word" && <div></div>}

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
