import React from "react"

const ChatCalls = () => {
  return (
    <aside
      className="w-1/4 h-screen bg-gray-50 border-l border-l-slate-200 border-r border-r-slate-200 font-poppins"
      aria-label="Chat Calls"
    >
      <section className="p-4">
        <h2 className="text-xl text-black/80 font-semibold mb-4">Calls</h2>
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
            <h1 className="text-black/80 font-semibold mb-4">Recent Calls</h1>
          </div>
          <div className="my-4 w-full">
            <ul className="space-y-4">
              <li className="flex items-center p-2 rounded hover:bg-gray-100 transition-all duration-500 cursor-pointer">
                <div className="size-12 rounded-full flex items-center justify-center bg-slate-100 mr-4"></div>
                <div className="flex flex-col justify-between gap-y-1">
                  <div className="font-semibold text-gray-800">John Doe</div>
                  <div className="flex items-center justify-left gap-x-2 text-gray-600 truncate">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-red-400">Missed Call</p>
                    </div>
                  </div>
                </div>
                <div className="text-xs flex flex-col ml-auto gap-y-2 text-gray-500">
                  <p>10:00 pm</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </aside>
  )
}

export default ChatCalls
