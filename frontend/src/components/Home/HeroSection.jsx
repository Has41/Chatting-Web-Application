import React from "react"
import mainImage from "../../assets/listen-music.jpg"

const HeroComponent = () => {
  return (
    <main className="mx-auto mt-14 flex w-[90%] items-center justify-center gap-x-10">
      <div>
        <h1 className="font-mont text-[48px] font-medium">
          Empower Connections With <span className="font-semibold text-green-400">ChitChat</span>
        </h1>
        <p className="mt-4 max-w-[700px] break-all">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est ut pariatur odit expedita reprehenderit aliquam
          asperiores harum eligendi ab quae.
        </p>
        <div className="mt-10 flex gap-x-6">
          <button className="flex items-center justify-center gap-x-2 rounded-3xl bg-black/90 px-2 py-1 text-white">
            <div className="pl-1">Try Out</div>
            <div className="rounded-full bg-white p-[9px]">
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
          <button className="flex items-center justify-center gap-x-2 rounded-3xl bg-slate-100 px-3 py-1 font-semibold">
            <div>Learn More</div>
            <div className="rounded-full bg-white p-[9px]">
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
