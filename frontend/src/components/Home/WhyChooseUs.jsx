import React from "react"
import chatVideo from "../../assets/sectionVid.mp4"
import { trustIcons } from "../../utils/dynamicData"

const WhyChooseUs = () => {
  return (
    <section className="mx-auto my-4 flex max-w-[85%] items-center justify-center gap-x-32 rounded-3xl bg-slate-50 px-6 py-4">
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <h1 className="ml-2 font-poppins text-5xl font-medium">24/7 Availability</h1>
          <h1 className="rounded-3xl bg-green-200 px-3 py-2 font-poppins text-4xl">Always Online, Always Connected</h1>
        </div>
        <p className="text-left">
          Your privacy is our top priority. With end-to-end encryption, your conversations stay between you and your
          contacts. Feel safe sharing your thoughts and moments.
        </p>
        <div className="flex gap-x-4">
          {trustIcons.map((icon, index) => {
            return (
              <div key={index} className="rounded-full bg-white p-3 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
                </svg>
              </div>
            )
          })}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl">
        <video className="aspect-[0.8/1.2] size-full object-cover" loop autoPlay muted>
          <source src={chatVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  )
}

export default WhyChooseUs
