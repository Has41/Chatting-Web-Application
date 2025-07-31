import usePDFMetadata from "../../hooks/usePDFMetaData"

const PDFPreview = ({ fileUrl, width = 250 }) => {
  const { canvasRef } = usePDFMetadata(fileUrl, width)

  return (
    <div className="flex h-72 w-full items-center justify-center overflow-hidden bg-white">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default PDFPreview
