import React from "react"

const FriendList = () => {
  return (
    <aside
      className="w-1/4 h-screen bg-gray-50 border-l border-l-slate-200 border-r border-r-slate-200 font-poppins"
      aria-label="Friend List"
    >
      <section className="p-4">
        <h2 className="text-xl text-black/80 font-semibold mb-4">Friends</h2>
        <div className="mb-4 relative w-11/12 mx-auto">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m2.7-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search friends"
            className="w-full pl-12 p-2 bg-slate-100 placeholder:text-slate-400 placeholder:text-sm rounded focus:outline-none focus:ring focus:ring-blue-300"
            aria-label="Search Chats"
          />
        </div>
        <div className="my-8">
          <div className="w-[5rem] h-14 bg-slate-100 shadow-sm rounded-lg relative flex flex-col items-center justify-center">
            <div className="relative">
              <div className="cursor-pointer size-12 mb-1 rounded-full -mt-5 bg-green-200"></div>
              {/* <img className="cursor-pointer size-12 mb-1 rounded-full -mt-5" src={onlineUser} alt="User" /> */}
              <span className="absolute bottom-1 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <p className="text-sm text-black/80 font-semibold">User</p>
          </div>
        </div>
        <div className="max-w-full">
          <div>
            <h1 className="text-black/80 font-semibold mb-4">All Friends</h1>
          </div>
          <div className="my-4 w-full">
            <ul className="space-y-4">
              <li className="flex items-center p-2 rounded hover:bg-gray-100 transition-all duration-500 cursor-pointer">
                <div className="size-12 rounded-full flex items-center justify-center bg-slate-100 mr-4"></div>
                <div className="font-semibold text-gray-800">John Doe</div>
                <div className="ml-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </aside>
  )
}

export default FriendList
