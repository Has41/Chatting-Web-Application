import type { ReactNode } from "react"

interface FilePreviewShellProps {
  isVisible: boolean
  onClose: () => void
  children: ReactNode
}

const FilePreviewShell = ({ isVisible, onClose, children }: FilePreviewShellProps) => (
  <div
    className={`absolute bottom-full left-0 z-50 w-full border-t border-b border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 ease-in-out ${
      isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
    }`}
  >
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-sm font-medium">Preview</h3>
      <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close file preview">
        ✕
      </button>
    </div>
    {children}
  </div>
)

export default FilePreviewShell
