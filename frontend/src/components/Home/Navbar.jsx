import React from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="mx-auto flex w-[90%] items-center justify-between py-8 font-poppins text-black/80">
      <h1 className="text-xl">ChitChat</h1>
      <div>
        <ul className="flex items-center justify-center gap-x-6 rounded-2xl bg-slate-50 px-6 py-1 text-black/80">
          <li>About</li>
          <li>Benefits</li>
          <li>App</li>
          <li>Features</li>
          <li>Reviews</li>
        </ul>
      </div>
      <div>
        <Link
          to={"/chat"}
          className="flex items-center justify-center gap-x-2 rounded-3xl bg-slate-100 px-2 py-1 font-medium"
        >
          <div className="pl-1">Get Started</div>
          <div className="rounded-full bg-green-300 p-[9px]">
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
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
