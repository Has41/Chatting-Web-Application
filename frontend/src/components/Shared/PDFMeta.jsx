import usePDFMetaData from "../../hooks/usePDFMetaData"

const PDFMeta = ({ mediaUrl }) => {
  const { numPages, fileName } = usePDFMetaData(mediaUrl)

  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow">
      <img src="/pdf-icon.svg" alt="PDF icon" className="h-12 w-12 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="max-w-xs truncate font-medium text-gray-900">{fileName}</span>
        {numPages != null ? (
          <span className="text-sm text-gray-500">
            {numPages} page{numPages > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-sm text-gray-400">Loading…</span>
        )}
      </div>
    </div>
  )
}

export default PDFMeta
