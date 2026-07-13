import { useMemo, useState } from "react"
import { useConversationFilesQuery } from "@chat/attachments/queries/conversationFilesQueries"
import {
  filterSharedFiles,
  getSharedFileFilterCounts,
  normalizeConversationFiles,
  resolveSharedFiles
} from "@chat/attachments/utils/sharedFiles"
import type { SharedFileFilter } from "@chat/attachments/types/sharedFiles"

export const useConversationFiles = (conversationId?: string) => {
  const [activeFilter, setActiveFilter] = useState<SharedFileFilter>("all")
  const { data, isLoading } = useConversationFilesQuery(conversationId)

  const files = useMemo(() => normalizeConversationFiles(data), [data])
  const resolvedFiles = useMemo(() => resolveSharedFiles(files), [files])
  const filterCounts = useMemo(() => getSharedFileFilterCounts(resolvedFiles), [resolvedFiles])
  const filteredFiles = useMemo(
    () => filterSharedFiles(resolvedFiles, activeFilter),
    [activeFilter, resolvedFiles]
  )

  return {
    activeFilter,
    files,
    filterCounts,
    filteredFiles,
    isLoading,
    resolvedFiles,
    setActiveFilter
  }
}
