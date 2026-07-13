import { useEffect, useRef } from "react"
import type { MediaViewerItem } from "@chat/attachments/components/MediaViewerModal"

interface UseMediaViewerNavigationOptions {
  items: MediaViewerItem[]
  currentIndex: number
  onCurrentIndexChange: (index: number) => void
}

export const useMediaViewerNavigation = ({ items, currentIndex, onCurrentIndexChange }: UseMediaViewerNavigationOptions) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const currentItem = items[currentIndex] ?? items[0]
  const hasMultipleItems = items.length > 1

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog?.open) dialog?.showModal()
  }, [])

  const goToPrevious = () => {
    onCurrentIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    onCurrentIndexChange(currentIndex === items.length - 1 ? 0 : currentIndex + 1)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && hasMultipleItems) {
        goToPrevious()
      }
      if (event.key === "ArrowRight" && hasMultipleItems) {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })

  return {
    dialogRef,
    currentItem,
    hasMultipleItems,
    goToPrevious,
    goToNext
  }
}
