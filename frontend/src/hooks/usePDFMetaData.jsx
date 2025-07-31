// src/hooks/usePDFMetadata.jsx
import { useEffect, useRef, useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const usePDFMetadata = (source, width = 250) => {
  const canvasRef = useRef(null)
  const [numPages, setNumPages] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fileName = decodeURIComponent(source?.split("/").pop().split("?")[0])

  console.log(fileName)
  useEffect(() => {
    if (!source) {
      setError("No PDF source provided")
      setLoading(false)
      return
    }

    let cancelled = false

    const loadAndRender = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(source)

        // 2) wait for PDF, extract numPages
        const pdf = await loadingTask.promise
        if (cancelled) return
        console.log(pdf)

        setNumPages(pdf.numPages)

        // 3) render first page
        const page = await pdf.getPage(1)

        const viewport = page.getViewport({ scale: 1 })
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        const scale = width / viewport.width
        const scaledViewport = page.getViewport({ scale })

        canvas.height = scaledViewport.height
        canvas.width = scaledViewport.width

        await page.render({
          canvasContext: context,
          viewport: scaledViewport
        }).promise
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadAndRender()
    return () => {
      cancelled = true
    }
  }, [source, width])

  return { fileName, canvasRef, numPages, loading, error }
}

export default usePDFMetadata
