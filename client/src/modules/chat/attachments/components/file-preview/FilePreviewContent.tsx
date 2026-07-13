import PDFPreview from "@chat/attachments/components/PDFPreview"
import type { FileType } from "@chat/attachments/types/attachments"

interface FilePreviewContentProps {
  file: File
  url: string
  resolvedFileType: string
  actualAttachmentType: FileType
}

const FilePreviewContent = ({ file, url, resolvedFileType, actualAttachmentType }: FilePreviewContentProps) => (
  <div className="my-4 flex justify-center">
    {resolvedFileType === "image" && (
      <div className="flex h-64 w-full items-center justify-center overflow-hidden">
        <img src={url} alt="preview" className="max-h-full max-w-full rounded object-contain" />
      </div>
    )}
    {resolvedFileType === "video" && <video src={url} controls className="max-h-48 rounded" />}
    {resolvedFileType === "audio" && <audio src={url} controls className="w-full" />}
    {actualAttachmentType === "document" && (
      <div className="flex h-72 w-full items-center justify-center rounded p-4">
        {file.type === "application/pdf" ? (
          <PDFPreview fileUrl={url} />
        ) : (
          <div className="text-center text-sm text-gray-600">
            <p className="mb-1">No preview available</p>
            <p className="text-xs text-gray-400">{file.name}</p>
          </div>
        )}
      </div>
    )}
  </div>
)

export default FilePreviewContent
