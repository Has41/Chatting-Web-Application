import { useEffect, useRef } from "react"
import { Crown, Trash2 } from "lucide-react"
import { createCallable } from "react-call"

export interface ConfirmActionProps {
  title: string
  description: string
  confirmLabel: string
  tone?: "warning" | "danger"
}

export const ConfirmAction = createCallable<ConfirmActionProps, boolean>(
  ({ call, title, description, confirmLabel, tone = "warning" }) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null)
    const danger = tone === "danger"

    useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog?.open) dialog?.showModal()
    }, [])

    return (
      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-sm bg-transparent p-4 backdrop:bg-black/45 backdrop:backdrop-blur-sm"
        aria-label={title}
        onClose={() => call.end(false)}
      >
        <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl">
          <div
            className={`mb-4 grid size-11 place-items-center rounded-full ${
              danger ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
            }`}
          >
            {danger ? <Trash2 size={20} /> : <Crown size={20} />}
          </div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => call.end(false)}
              className="h-10 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => call.end(true)}
              className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${
                danger ? "bg-red-600 text-white hover:bg-red-500" : "bg-[#96e6a1] text-[#102315] hover:bg-[#86dc92]"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    )
  }
)
