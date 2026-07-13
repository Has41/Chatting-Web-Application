import type { ReactNode } from "react"

interface CallButtonProps {
  children: ReactNode
  label: string
  onClick: () => void
  pressed?: boolean
  tone: "accept" | "danger" | "ghost" | "light"
}

const CallButton = ({ children, label, onClick, pressed, tone }: CallButtonProps) => {
  const toneClass =
    tone === "accept"
      ? "bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:ring-emerald-200"
      : tone === "danger"
        ? "bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-200"
        : tone === "light"
          ? "bg-white text-slate-950 hover:bg-slate-100 focus-visible:ring-white/70"
          : "bg-white/12 text-white hover:bg-white/18 focus-visible:ring-white/70"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex size-12 items-center justify-center rounded-full shadow-md transition duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95 ${toneClass}`}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
    >
      {children}
    </button>
  )
}

export default CallButton
