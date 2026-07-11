import usePDFMetadata from "@chat/attachments/hooks/usePDFMetaData"

interface PDFPreviewProps {
  fileUrl: string
  width?: number
}

const PDFPreview = ({ fileUrl, width = 250 }: PDFPreviewProps) => {
  const { canvasRef } = usePDFMetadata(fileUrl, width)

  return (
    <div className="flex h-72 w-full items-center justify-center overflow-hidden bg-white">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default PDFPreview
