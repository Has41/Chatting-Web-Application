const ChannelsList = () => {
  return (
    <aside
      className="h-screen w-1/4 border-l border-r border-l-slate-200 border-r-slate-200 bg-gray-50 font-poppins"
      aria-label="Chat Calls"
    >
      <section className="p-4">
        <h2 className="mb-4 text-xl font-semibold text-black/80">Channels</h2>
        <div className="relative mx-auto mb-4 w-11/12">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 text-gray-400"
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
            placeholder="Search channels"
            className="w-full rounded bg-slate-100 p-2 pl-12 placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-blue-300"
            aria-label="Search Chats"
          />
        </div>
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
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-black/80">Your Channels</h1>
            </div>
            <div>
              <button className="rounded-3xl bg-custom-green px-2 py-1 text-sm text-white transition-all duration-500 hover:bg-green-300">
                Explore
              </button>
            </div>
          </div>
          <div className="my-4 w-full">
            <ul className="space-y-4">
              <li className="flex cursor-pointer items-center rounded p-2 transition-all duration-500 hover:bg-gray-100">
                {/* Profile Image Div */}
                <div className="mr-3 h-12 w-12 rounded-full bg-slate-200">
                  {/* <img className="w-full h-full" src="profileImageURL" alt="User" /> */}
                </div>
                {/* Chat Details Div (Username and Recent Message) */}
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">ChitChat</div>
                  <div className="truncate text-sm text-gray-600">Updates</div>
                </div>
                {/* Time Div (Separated) */}
                <div className="flex flex-col gap-y-2 text-xs text-gray-500">
                  <div>
                    <p>10:00 pm</p>
                  </div>
                  <div className="ml-auto flex size-6 items-center justify-center rounded-full bg-green-100 text-center text-green-500">
                    <p>5</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </aside>
  )
}

export default ChannelsList
