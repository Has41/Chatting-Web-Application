import usePDFMetaData from "../../hooks/usePDFMetaData"
import truncateText from "../../utils/truncateText"
import pdfIcon from "../../assets/pdf_icon.png"

const PDFMeta = ({ mediaUrl }) => {
  const { numPages, fileName } = usePDFMetaData(mediaUrl)

  return (
    <div className="flex items-center gap-x-4 rounded-lg bg-green-400 p-2 shadow">
      <img src={pdfIcon} alt="PDF icon" className="size-8 flex-shrink-0" />
      <div className="flex flex-col gap-y-2">
        <span className="max-w-xs truncate text-sm font-medium text-white">{truncateText(fileName, 20, 20)}</span>
        {numPages != null ? (
          <span className="text-xs text-white">
            {numPages} page{numPages > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-sm text-gray-400">Loading…</span>
        )}
      </div>
      <div>
        <a href={mediaUrl} download={true} target="_blank" rel="noopener noreferrer" className="text-sm underline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default PDFMeta
