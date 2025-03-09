import React, { useState } from "react"
import DarkModeSwitch from "../../Shared/DarkModeSwitch"

const ThemeSettings = () => {
  // Define six theme colors (you can adjust these values as needed)
  const colors = [
    "#ff6347", // Tomato
    "#4682b4", // Steel Blue
    "#32cd32", // Lime Green
    "#ffd700", // Gold
    "#8a2be2", // Blue Violet
    "#ff8c00" // Dark Orange
  ]

  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [darkMode, setDarkMode] = useState(false)

  // Handle when a user selects a theme color
  const handleColorChange = (color) => {
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
          {colors.map((color, index) => (
            <button
              key={index}
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
