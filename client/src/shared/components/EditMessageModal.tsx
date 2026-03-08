import { createPortal } from "react-dom"

const EditMessageModal = ({ setEditContent, setShowEditModal, editMessage, editContent, editingMessageId }) => {
  return createPortal(
    <div className="bg-opacity-50 font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-96 rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Edit Message</h2>

        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="focus:ring-custom-green h-28 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-800 shadow-sm focus:ring-2 focus:outline-none"
        />

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => {
              editMessage({ messageId: editingMessageId, content: editContent })
              setShowEditModal(false)
            }}
            className="bg-custom-green w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            onClick={() => setShowEditModal(false)}
            className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default EditMessageModal
