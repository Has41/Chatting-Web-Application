const CreateGroupButton = ({
  selectedCount,
  isLoading,
  onClick
}: {
  selectedCount: number
  isLoading: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={selectedCount < 2 || isLoading}
    className="bg-custom-green mt-4 w-full rounded px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
  >
    Create Group with {selectedCount} {selectedCount === 1 ? "member" : "members"}
  </button>
)

export default CreateGroupButton
