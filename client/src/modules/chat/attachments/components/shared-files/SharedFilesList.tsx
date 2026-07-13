import SharedFileRow from "@chat/attachments/components/shared-files/SharedFileRow"
import { sharedFileFilters } from "@chat/attachments/utils/sharedFiles"
import type { ResolvedSharedFile, SharedFileFilter } from "@chat/attachments/types/sharedFiles"

interface SharedFilesListProps {
  activeFilter: SharedFileFilter
  filteredFiles: ResolvedSharedFile[]
  resolvedFiles: ResolvedSharedFile[]
}

const SharedFilesList = ({ activeFilter, filteredFiles, resolvedFiles }: SharedFilesListProps) => {
  if (!resolvedFiles.length) {
    return <div className="rounded-md bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">No files shared yet</div>
  }

  return (
    <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
      {filteredFiles.length ? (
        filteredFiles.map((file, index) => (
          <SharedFileRow key={file._id || file.mediaUrl || index} file={file} />
        ))
      ) : (
        <div className="rounded-md bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
          No {sharedFileFilters.find((filter) => filter.key === activeFilter)?.label.toLowerCase()} shared yet
        </div>
      )}
    </div>
  )
}

export default SharedFilesList
