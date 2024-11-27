import React from "react"
import mainImage from "../../assets/listen-music.jpg"

const HeroComponent = () => {
  return (
    <main className="flex items-center justify-center w-[90%] mx-auto gap-x-10 mt-14">
      <div>
        <h1 className="text-[48px] font-medium font-mont">
          Empower Connections With <span className="text-green-400 font-semibold">ChitChat</span>
        </h1>
        <p className="break-all max-w-[700px] mt-4">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est ut pariatur odit expedita reprehenderit aliquam asperiores
          harum eligendi ab quae.
        </p>
        <div className="mt-10 flex gap-x-6">
          <button className="px-2 py-1 rounded-3xl bg-black/90 text-white flex items-center justify-center gap-x-2">
            <div className="pl-1">Try Out</div>
            <div className="bg-white rounded-full p-[9px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 text-black/90"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </button>
          <button className="px-3 py-1 font-semibold rounded-3xl bg-slate-100 flex items-center justify-center gap-x-2">
            <div>Learn More</div>
            <div className="bg-white rounded-full p-[9px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 text-black/90"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </button>
        </div>
      </div>
      <div>
        <img width={800} height={1500} src={mainImage} className="shadow-md" />
      </div>
    </main>
  )
}

export default HeroComponent
