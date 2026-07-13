import SharedFileFilters from "@chat/attachments/components/shared-files/SharedFileFilters"
import SharedFilesHeader from "@chat/attachments/components/shared-files/SharedFilesHeader"
import SharedFilesList from "@chat/attachments/components/shared-files/SharedFilesList"
import SharedFilesSkeleton from "@chat/attachments/components/shared-files/SharedFilesSkeleton"
import { useConversationFiles } from "@chat/attachments/hooks/useConversationFiles"

interface ChatInfoFilesProps {
  conversationId?: string
}

const ChatInfoFiles = ({ conversationId }: ChatInfoFilesProps) => {
  const { activeFilter, files, filterCounts, filteredFiles, isLoading, resolvedFiles, setActiveFilter } =
    useConversationFiles(conversationId)

  return (
    <section className="mt-6 border-t px-4 pt-4">
      <SharedFilesHeader count={files.length} />
      <SharedFileFilters activeFilter={activeFilter} filterCounts={filterCounts} onFilterChange={setActiveFilter} />
      {isLoading ? (
        <SharedFilesSkeleton />
      ) : (
        <SharedFilesList activeFilter={activeFilter} filteredFiles={filteredFiles} resolvedFiles={resolvedFiles} />
      )}
    </section>
  )
}

export default ChatInfoFiles
