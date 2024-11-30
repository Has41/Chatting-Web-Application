import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import firstOperator from "../../assets/operator1.jpg"
import secondOperator from "../../assets/operator2.jpg"
import thirdOperator from "../../assets/operator3.jpg"
import fourthOperator from "../../assets/operator4.jpg"
import { connectIcons } from "../../utils/dynamicData"

const ConnectSection = () => {
  const firstImgRef = useRef(null)
  const secondImgRef = useRef(null)
  const thirdImgRef = useRef(null)
  const fourthImgRef = useRef(null)

  useGSAP(() => {
    const timeLine = gsap.timeline()

    timeLine.set([firstImgRef.current, secondImgRef.current, thirdImgRef.current, fourthImgRef.current], {
      delay: 1,
      opacity: 0
    })
    timeLine.to([firstImgRef.current, secondImgRef.current, thirdImgRef.current, fourthImgRef.current], {
      opacity: 1,
      duration: 1.5,
      stagger: 0.7
    })
    timeLine.set([firstImgRef.current, secondImgRef.current, thirdImgRef.current, fourthImgRef.current], {
      clearProps: "all"
    })

    return () => timeLine.kill()
  })

  return (
    <section className="flex flex-col justify-center gap-y-36 shadow-sm overflow-y-hidden font-poppins bg-slate-50 w-[95%] h-[900px] mx-auto mt-20 px-4 rounded-xl">
      <div className="flex justify-center gap-x-8">
        <div className="">
          <h1 className="text-[45px] max-w-[700px] leading-tight text-black/90">
            Connect Instantly, Communicate Effortlessly - <span className="bg-green-200 px-3 rounded-3xl">ChitChat</span>
          </h1>
          <div className="flex justify-center gap-x-4 mt-6">
            {connectIcons.map((icon, index) => {
              return (
                <div
                  key={index}
                  className="bg-white h-[40px] w-[40px] flex items-center justify-center rounded-full shadow-md"
                >
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
      <div className="flex items-center justify-center gap-x-4 flex-wrap">
        <div className="pb-20">
          <div className="max-w-[300px] aspect-square">
            <img
              className="rounded-lg object-cover"
              loading="lazy"
              ref={firstImgRef}
              src={firstOperator}
              alt="First Operator"
            />
          </div>
        </div>
        <div className="pt-20">
          <div className="max-w-[300px] aspect-square">
            <img
              className="rounded-lg object-cover"
              loading="lazy"
              ref={secondImgRef}
              src={secondOperator}
              alt="Second Operator"
            />
          </div>
        </div>
        <div className="pb-20">
          <div className="max-w-[300px] aspect-square">
            <img
              className="rounded-lg object-cover"
              loading="lazy"
              ref={thirdImgRef}
              src={thirdOperator}
              alt="Third Operator"
            />
          </div>
        </div>
        <div className="pt-20">
          <div className="max-w-[300px] aspect-square">
            <img
              className="rounded-lg object-cover"
              loading="lazy"
              ref={fourthImgRef}
              src={fourthOperator}
              alt="Fourth Operator"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConnectSection
