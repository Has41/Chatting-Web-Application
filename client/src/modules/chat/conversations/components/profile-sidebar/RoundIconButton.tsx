import type { ReactNode } from "react"

const RoundIconButton = ({
  children,
  onClick,
  disabled,
  label
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  label: string
}) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-custom-green flex size-7 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
    disabled={disabled}
    aria-label={label}
  >
    {children}
  </button>
)

export default RoundIconButton
