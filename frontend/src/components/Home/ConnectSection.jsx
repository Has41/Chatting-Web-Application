import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import firstOperator from "../../assets/operator1.jpg"
import secondOperator from "../../assets/operator2.jpg"
import thirdOperator from "../../assets/operator3.jpg"
import fourthOperator from "../../assets/operator4.jpg"
import { connectIcons } from "../../utils/dynamicData"

const ConnectSection = () => {
  const imgRefs = {
    firstImgRef: useRef(null),
    secondImgRef: useRef(null),
    thirdImgRef: useRef(null),
    fourthImgRef: useRef(null)
  }

  const { firstImgRef, secondImgRef, thirdImgRef, fourthImgRef } = imgRefs

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
    <section className="mx-auto mt-20 flex h-[900px] w-[95%] flex-col justify-center gap-y-36 overflow-y-hidden rounded-xl bg-slate-50 px-4 font-poppins shadow-sm">
      <div className="flex justify-center gap-x-8">
        <div className="">
          <h1 className="max-w-[700px] text-[45px] leading-tight text-black/90">
            Connect Instantly, Communicate Effortlessly - <span className="rounded-3xl bg-green-200 px-3">ChitChat</span>
          </h1>
          <div className="mt-6 flex justify-center gap-x-4">
            {connectIcons.map((icon, index) => {
              return (
                <div
                  key={index}
                  className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-md"
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
            <button className="flex items-center justify-center gap-x-2 rounded-3xl bg-black/80 px-2 py-1 text-white">
              <div className="pl-1">Get Started</div>
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
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4">
        <div className="pb-20">
          <div className="aspect-square max-w-[300px]">
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
          <div className="aspect-square max-w-[300px]">
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
          <div className="aspect-square max-w-[300px]">
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
          <div className="aspect-square max-w-[300px]">
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
