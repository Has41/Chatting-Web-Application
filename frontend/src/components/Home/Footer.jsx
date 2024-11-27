import React from "react"

const Footer = () => {
  return (
    <footer className="flex items-center justify-between px-10 py-8 font-poppins">
      <div className="text-black/80">
        <span>&copy;</span> 2024.
      </div>
      <div className="flex gap-x-4 text-black/80 text-sm">
        <div>Terms Of Use</div>
        <div>Help Center</div>
      </div>
    </footer>
  )
}

export default Footer
