import React from "react"
import firstOperator from "../../assets/operator1.jpg"
import secondOperator from "../../assets/operator2.jpg"
import thirdOperator from "../../assets/operator3.jpg"
import fourthOperator from "../../assets/operator4.jpg"

const ConnectSection = () => {
  return (
    <section className="flex flex-col justify-center gap-y-36 shadow-sm overflow-y-hidden font-poppins bg-slate-50 w-[95%] h-[900px] mx-auto mt-20 px-4 rounded-xl">
      <div className="flex justify-center gap-x-8">
        <div className="">
          <h1 className="text-[45px] max-w-[700px] leading-tight text-black/90">
            Connect Instantly, Communicate Effortlessly - <span className="bg-green-200 px-3 rounded-3xl">ChitChat</span>
          </h1>
          <div className="flex gap-x-3 mt-4">
            <div className="bg-white h-[40px] w-[40px] flex items-center justify-center rounded-full shadow-md">
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
                  d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                />
              </svg>
            </div>
            <div className="bg-white h-[40px] w-[40px] flex items-center justify-center rounded-full shadow-md">
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
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </div>
            <div className="bg-white h-[40px] w-[40px] flex items-center justify-center rounded-full shadow-md">
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
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <p className="max-w-[450px] tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet tenetur error quasi. Eum illo qui illum voluptatum
            quibusdam nulla vel?
          </p>
          <div>
            <button className="px-2 py-1 rounded-3xl bg-black/80 text-white flex items-center justify-center gap-x-2">
              <div className="pl-1">Get Started</div>
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
      </div>
      <div className="flex items-center justify-center gap-x-8">
        <div className="pb-20">
          <img className="h-[300px] rounded-lg" width={3500} src={firstOperator} alt="" />
        </div>
        <div className="pt-20">
          <img className="h-[300px] rounded-lg" width={3500} src={secondOperator} alt="" />
        </div>
        <div className="pb-20">
          <img className="h-[300px] rounded-lg" width={3500} src={thirdOperator} alt="" />
        </div>
        <div className="pt-20">
          <img className="h-[300px] rounded-lg" width={3500} src={fourthOperator} alt="" />
        </div>
      </div>
    </section>
  )
}

export default ConnectSection
