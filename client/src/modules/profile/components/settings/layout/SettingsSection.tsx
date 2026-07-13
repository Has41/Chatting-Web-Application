import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

interface SettingsSectionProps {
  id: string
  title: string
  isOpen: boolean
  children: ReactNode
  contentClassName?: string
  onToggle: (section: string) => void
}

const SettingsSection = ({ id, title, isOpen, children, contentClassName = "mt-2 pl-4", onToggle }: SettingsSectionProps) => {
  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full cursor-pointer items-center justify-between p-2"
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className={`${contentClassName} text-sm text-gray-600`}>{children}</div>}
    </div>
  )
}

export default SettingsSection
