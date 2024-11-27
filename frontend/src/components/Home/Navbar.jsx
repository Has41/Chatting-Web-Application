import React from "react"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between mx-auto py-8 w-[90%] font-poppins text-black/80">
      <h1 className="text-xl">ChitChat</h1>
      <div>
        <ul className="flex items-center justify-center text-black/80 gap-x-6 bg-slate-50 px-6 py-1 rounded-2xl">
          <li>About</li>
          <li>Benefits</li>
          <li>App</li>
          <li>Features</li>
          <li>Reviews</li>
        </ul>
      </div>
      <div>
        <button className="px-2 py-1 rounded-3xl bg-slate-100 flex items-center justify-center gap-x-2 font-medium">
          <div className="pl-1">Get Started</div>
          <div className="bg-green-300 rounded-full p-[9px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 text-black/80"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
