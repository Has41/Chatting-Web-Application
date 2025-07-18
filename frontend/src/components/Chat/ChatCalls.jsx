const ChatCalls = () => {
  return (
    <aside
      className="h-screen w-1/4 border-l border-r border-l-slate-200 border-r-slate-200 bg-gray-50 font-poppins"
      aria-label="Chat Calls"
    >
      <section className="p-4">
        <h2 className="mb-4 text-xl font-semibold text-black/80">Calls</h2>
        <div className="my-8">
          <div className="relative flex h-14 w-[5rem] flex-col items-center justify-center rounded-lg bg-slate-100 shadow-sm">
            <div className="relative">
              <div className="-mt-5 mb-1 size-12 cursor-pointer rounded-full bg-green-200"></div>
              {/* <img className="cursor-pointer size-12 mb-1 rounded-full -mt-5" src={onlineUser} alt="User" /> */}
              <span className="absolute bottom-1 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
            </div>
            <p className="text-sm font-semibold text-black/80">User</p>
          </div>
        </div>
        <div className="max-w-full">
          <div>
            <h1 className="mb-4 font-semibold text-black/80">Recent Calls</h1>
          </div>
          <div className="my-4 w-full">
            <ul className="space-y-4">
              <li className="flex cursor-pointer items-center rounded p-2 transition-all duration-500 hover:bg-gray-100">
                <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-slate-100"></div>
                <div className="flex flex-col justify-between gap-y-1">
                  <div className="font-semibold text-gray-800">John Doe</div>
                  <div className="justify-left flex items-center gap-x-2 truncate text-gray-600">
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
                <div className="ml-auto flex flex-col gap-y-2 text-xs text-gray-500">
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
