import { useState } from "react"
import DarkModeSwitch from "@shared/components/DarkModeSwitch"

const THEME_COLORS = [
  "#ff6347",
  "#4682b4",
  "#32cd32",
  "#ffd700",
  "#8a2be2",
  "#ff8c00"
]

const ThemeSettings = () => {
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0])
  const [darkMode, setDarkMode] = useState(false)

  // Handle when a user selects a theme color
  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    // Optionally update a context or global CSS variable here
    // document.documentElement.style.setProperty('--theme-color', color)
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
    // For example, update the document's class list to apply dark styles globally
    // document.body.classList.toggle("dark", !darkMode)
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <p className="mb-2 text-sm">Select a theme color:</p>
        <div className="flex space-x-3">
          {THEME_COLORS.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => handleColorChange(color)}
              style={{ backgroundColor: color }}
              className={`h-8 w-8 rounded-full border-2 ${
                selectedColor === color ? "border-black" : "border-transparent"
              } focus:outline-none`}
              aria-label={`Select theme color ${color}`}
            />
          ))}
        </div>
      </div>
      <DarkModeSwitch />
    </div>
  )
}

export default ThemeSettings
