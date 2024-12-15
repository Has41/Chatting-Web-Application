import React from "react"
import { chatOptions } from "../../utils/dynamicData"

const Chatbox = () => {
  return (
    <section className="flex h-screen w-[69%] flex-col font-poppins">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between border-b px-4 py-3 text-black/80">
        <div className="flex items-center gap-x-3">
          <div className="size-10 rounded-full bg-slate-200"></div>
          <div className="flex items-center gap-x-2">
            <h1 className="mb-[0.1rem] font-semibold">Username</h1>
            <div className="size-[0.6rem] rounded-full bg-custom-green"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {chatOptions.map((option, index) => (
            <div key={index} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={option.path} />
              </svg>
            </div>
          ))}
        </div>
      </nav>

      {/* Main Chat Area */}
      <div className="flex-grow overflow-y-auto bg-gray-100 p-4">
        {/* Example Messages */}
        <div className="flex max-w-full flex-col gap-6">
          {/* Received Message */}
          <div className="min-w-[10%] max-w-[50%] self-start">
            {/* Message Bubble */}
            <div className="ml-8 inline-block rounded-recieved rounded-tl-xl bg-white px-4 py-2 shadow">
              Hello, how may I help you?
            </div>
            {/* PFP and Name */}
            <div className="mt-2 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200"></div> {/* Placeholder for Profile Picture */}
            </div>
          </div>

          {/* Sent Message */}
          <div className="min-w-[10%] max-w-[50%] self-end">
            <div className="inline-block rounded-sent bg-custom-green px-4 py-2 text-white shadow">
              I was wondering about the status of my order.
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex max-w-full items-center gap-3 border-t p-4">
        <div className="w-[5%]">
          <button className="rounded-full p-3 text-black/80 transition-all duration-500 hover:text-custom-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="w-3/4 rounded-md border border-slate-200 p-3 focus:outline-none"
        />
        <div className="flex w-[15%] gap-x-1">
          <button className="rounded-full p-3 text-black/80 transition-all duration-500 hover:text-custom-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
              />
            </svg>
          </button>
          <button className="rounded-full p-3 text-black/80 transition-all duration-500 hover:text-custom-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
              />
            </svg>
          </button>
          <button className="rounded-full bg-custom-green p-3 text-white transition-all duration-500 hover:bg-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Chatbox
