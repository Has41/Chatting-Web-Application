import { useRef, useState } from "react"

interface PDFMeta {
  numPages: number
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creationDate?: Date
}

export const usePDFMetaData = (mediaUrl?: string, _width?: number) => {
  const [meta, setMeta] = useState<PDFMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const extractMeta = async (file: File): Promise<PDFMeta | null> => {
    setLoading(true)
    setError(null)

    try {
      const pdfjsLib = await import("pdfjs-dist")

      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      const metadata = await pdf.getMetadata()
      const info = metadata.info as Record<string, unknown>

      const pdfMeta: PDFMeta = {
        numPages: pdf.numPages,
        title: info?.Title as string | undefined,
        author: info?.Author as string | undefined,
        subject: info?.Subject as string | undefined,
        keywords: info?.Keywords as string | undefined,
        creationDate: info?.CreationDate ? new Date(info.CreationDate as string) : undefined
      }

      setMeta(pdfMeta)
      setLoading(false)
      return pdfMeta
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extract PDF metadata"
      setError(message)
      setLoading(false)
      return null
    }
  }

  const reset = () => {
    setMeta(null)
    setLoading(false)
    setError(null)
  }

  return {
    meta,
    numPages: meta?.numPages ?? null,
    fileName: mediaUrl ? mediaUrl.split("/").pop() || "document.pdf" : "document.pdf",
    canvasRef,
    loading,
    error,
    extractMeta,
    reset
  }
}

export default usePDFMetaData
