import { getSharedFileBadge } from "@chat/attachments/utils/sharedFiles"
import type { ResolvedSharedFile } from "@chat/attachments/types/sharedFiles"

interface SharedFileRowProps {
  file: ResolvedSharedFile
}

const SharedFileRow = ({ file }: SharedFileRowProps) => {
  const mediaUrl = file.mediaUrl ?? ""
  const fileType = file.resolvedType

  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-md p-2 transition hover:bg-slate-100"
    >
      {fileType === "image" && mediaUrl ? (
        <img src={mediaUrl} alt={file.title} className="size-10 rounded object-cover" />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded bg-slate-100 text-[0.65rem] font-bold text-slate-600">
          {getSharedFileBadge(fileType)}
        </div>
      )}

      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-medium text-slate-800">{file.title}</p>
        <p className="text-xs capitalize text-slate-500">{fileType === "other" ? "File" : fileType}</p>
      </div>
    </a>
  )
}

export default SharedFileRow
