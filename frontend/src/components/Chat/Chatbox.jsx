import React from "react"
import { chatOptions } from "../../utils/dynamicData"

const Chatbox = () => {
  return (
    <section className="w-[69%] h-screen flex flex-col font-poppins">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between py-3 px-4 text-black/80 border-b">
        <div className="flex items-center gap-x-3">
          <div className="size-10 rounded-full bg-slate-200"></div>
          <div className="flex items-center gap-x-2">
            <h1 className="font-semibold mb-[0.1rem]">Username</h1>
            <div className="size-[0.6rem] bg-custom-green rounded-full"></div>
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
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
        {/* Example Messages */}
        <div className="flex flex-col gap-6 max-w-full">
          {/* Received Message */}
          <div className="self-start min-w-[10%] max-w-[50%]">
            {/* Message Bubble */}
            <div className="bg-white px-4 py-2 shadow rounded-tl-xl ml-8 rounded-recieved inline-block ">
              Hello, how may I help you?
            </div>
            {/* PFP and Name */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-slate-200"></div> {/* Placeholder for Profile Picture */}
            </div>
          </div>

          {/* Sent Message */}
          <div className="self-end min-w-[10%] max-w-[50%]">
            <div className="bg-custom-green text-white px-4 py-2 shadow rounded-sent inline-block ">
              I was wondering about the status of my order.
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t flex items-center gap-3 max-w-full">
        <div className="w-[5%]">
          <button className="text-black/80 p-3 rounded-full hover:text-custom-text transition-all duration-500">
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
          className="w-3/4 p-3 border border-slate-200 rounded-md focus:outline-none"
        />
        <div className="flex w-[15%] gap-x-1">
          <button className="text-black/80 p-3 rounded-full hover:text-custom-text transition-all duration-500">
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
          <button className="text-black/80 p-3 rounded-full hover:text-custom-text transition-all duration-500">
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
          <button className="bg-custom-green text-white p-3 rounded-full hover:bg-green-400 transition-all duration-500">
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
