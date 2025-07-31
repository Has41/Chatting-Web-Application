import { createPortal } from "react-dom"
import { attachmentMenuOptions } from "../../utils/dynamicData"

const AttachmentMenu = ({ onSelect, onClose }) => {
  return createPortal(
    <div
      className="fixed bottom-16 right-10 z-50 w-48 rounded-lg bg-white p-4 font-poppins shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-2 gap-4">
        {attachmentMenuOptions.map((menu, index) => (
          <button
            key={index}
            onClick={() => onSelect(menu.type)}
            className="flex flex-col items-center space-y-2 rounded p-3 text-gray-800 transition hover:bg-green-50"
          >
            <div className="rounded-full bg-custom-green/40 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-green-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={menu.iconPath} />
              </svg>
            </div>
            <span className="text-center text-sm">{menu.name}</span>
          </button>
        ))}
      </div>
    </div>,
    document.body
  )
}

export default AttachmentMenu
