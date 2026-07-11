import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import resolveFilePreviewType from "@shared/utils/resolveFilePreviewType"

interface ConversationFile {
  _id?: string
  mediaUrl?: string
  thumbnailUrl?: string
  caption?: string
  mediaType?: string
  mimeType?: string
  fileName?: string
  createdAt?: string
}

interface ChatInfoFilesProps {
  conversationId?: string
}

type FileFilter = "all" | "image" | "video" | "file"

interface ResolvedConversationFile extends ConversationFile {
  resolvedType: string
  title: string
}

const fileFilters: Array<{ key: FileFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
  { key: "file", label: "Files" }
]

const getFileName = (url: string) => {
  const rawName = url.split("?")[0]?.split("/").pop() || "Shared file"
  return decodeURIComponent(rawName.replace(/\.[^/.]+$/, "")) || "Shared file"
}

const getFileBadge = (fileType: string) => {
  if (fileType === "image") return "IMG"
  if (fileType === "video") return "VID"
  if (fileType === "audio") return "AUD"
  if (fileType === "pdf") return "PDF"
  if (["word", "excel", "powerpoint"].includes(fileType)) return "DOC"

  return "FILE"
}

const ChatInfoFiles = ({ conversationId }: ChatInfoFilesProps) => {
  const [activeFilter, setActiveFilter] = useState<FileFilter>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["conversationFiles", conversationId],
    queryFn: async () => {
      const response = await axiosInstance.get(`${CONVERSATION_PATHS.GET_CURRENT_MEDIA}/${conversationId}`)
      return response.data
    },
    enabled: !!conversationId
  })

  const files = useMemo<ConversationFile[]>(() => {
    if (Array.isArray(data?.files)) return data.files.map((file: any) => ({ _id: file._id, ...file.media, createdAt: file.createdAt }))
    if (Array.isArray(data?.mediaUrls)) return data.mediaUrls.map((mediaUrl: string) => ({ mediaUrl }))
    return []
  }, [data])

  const resolvedFiles = useMemo<ResolvedConversationFile[]>(() => {
    return files.map((file) => {
      const mediaUrl = file.mediaUrl ?? ""
      const resolvedType = resolveFilePreviewType({
        mediaUrl,
        mediaType: file.mediaType,
        mimeType: file.mimeType,
        fileName: file.fileName
      })
      const title = file.caption?.trim() || file.fileName || getFileName(mediaUrl)

      return {
        ...file,
        resolvedType,
        title
      }
    })
  }, [files])

  const filterCounts = useMemo(() => {
    return {
      all: resolvedFiles.length,
      image: resolvedFiles.filter((file) => file.resolvedType === "image").length,
      video: resolvedFiles.filter((file) => file.resolvedType === "video").length,
      file: resolvedFiles.filter((file) => !["image", "video"].includes(file.resolvedType)).length
    }
  }, [resolvedFiles])

  const filteredFiles = useMemo(() => {
    if (activeFilter === "all") return resolvedFiles
    if (activeFilter === "file") return resolvedFiles.filter((file) => !["image", "video"].includes(file.resolvedType))
    return resolvedFiles.filter((file) => file.resolvedType === activeFilter)
  }, [activeFilter, resolvedFiles])

  return (
    <section className="mt-6 border-t px-4 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">Files</h4>
        <span className="text-xs font-medium text-slate-500">{files.length}</span>
      </div>

      <div className="mb-3 flex gap-1 rounded-md bg-slate-100 p-1">
        {fileFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded px-2 py-1.5 text-xs font-semibold transition ${
              activeFilter === filter.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="truncate">{filter.label}</span>
            <span className="text-[0.65rem] font-medium opacity-70">{filterCounts[filter.key]}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex animate-pulse items-center gap-3 rounded-md p-2">
              <div className="size-10 rounded bg-slate-200" />
              <div className="min-w-0 flex-1">
                <div className="mb-2 h-3 w-3/4 rounded bg-slate-200" />
                <div className="h-2 w-1/2 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : resolvedFiles.length ? (
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {filteredFiles.length ? (
            filteredFiles.map((file, index) => {
            const mediaUrl = file.mediaUrl ?? ""
            const fileType = file.resolvedType
            const title = file.title

            return (
              <a
                key={file._id || mediaUrl || index}
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-md p-2 transition hover:bg-slate-100"
              >
                {fileType === "image" && mediaUrl ? (
                  <img src={mediaUrl} alt={title} className="size-10 rounded object-cover" />
                ) : (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded bg-slate-100 text-[0.65rem] font-bold text-slate-600">
                    {getFileBadge(fileType)}
                  </div>
                )}

                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-slate-800">{title}</p>
                  <p className="text-xs capitalize text-slate-500">{fileType === "other" ? "File" : fileType}</p>
                </div>
              </a>
            )
            })
          ) : (
            <div className="rounded-md bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
              No {fileFilters.find((filter) => filter.key === activeFilter)?.label.toLowerCase()} shared yet
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">No files shared yet</div>
      )}
    </section>
  )
}

export default ChatInfoFiles
