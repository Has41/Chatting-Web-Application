import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const AppBenefits = () => {
  const containerRef = useRef()
  const tile1Ref = useRef()
  let subTileLogo1Ref = useRef()
  let subTileSection1Ref = useRef()
  const tile2Ref = useRef()
  let subTileLogo2Ref = useRef()
  let subTileSection2Ref = useRef()
  const tile3Ref = useRef()
  let subTileLogo3Ref = useRef()
  let subTileSection3Ref = useRef()
  const tile4Ref = useRef()
  let subTileLogo4Ref = useRef()
  let subTileSection4Ref = useRef()

  gsap.registerPlugin(ScrollTrigger)

  useGSAP(() => {
    const timeLine = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 50%",
        end: () => `bottom+=${tile4Ref.current.offsetTop + tile4Ref.current.offsetHeight - containerRef.current.offsetTop}`,
        onEnter: () => timeLine.restart(),
        onEnterBack: () => timeLine.restart()
        // markers: true
      }
    })

    timeLine
      //1st tile Animation
      .to([subTileSection1Ref.current], { duration: 1, width: "55%" })
      .to(tile1Ref.current, { duration: 1, maxWidth: "90%" }, "-=1")
      .to(subTileLogo1Ref.current, { duration: 1, width: "45%" }, "-=1")
      .to([subTileSection1Ref.current], { opacity: 1 })

      //2nd tile Animation
      .to([subTileSection2Ref.current], { duration: 1, width: "55%" })
      .to(tile2Ref.current, { duration: 1, maxWidth: "90%" }, "-=1")
      .to(subTileLogo2Ref.current, { duration: 1, width: "45%" }, "-=1")
      .to([subTileSection2Ref.current], { opacity: 1 })

      //3rd tile Animation
      .to([subTileSection3Ref.current], { duration: 1, width: "55%" })
      .to(tile3Ref.current, { duration: 1, maxWidth: "90%" }, "-=1")
      .to(subTileLogo3Ref.current, { duration: 1, width: "45%" }, "-=1")
      .to([subTileSection3Ref.current], { opacity: 1 })

      //4th tile Animation
      .to([subTileSection4Ref.current], { duration: 1, width: "55%" })
      .to(tile4Ref.current, { duration: 1, maxWidth: "90%" }, "-=1")
      .to(subTileLogo4Ref.current, { duration: 1, width: "45%" }, "-=1")
      .to([subTileSection4Ref.current], { opacity: 1 })
  })

  return (
    <section className="py-20">
      <div ref={containerRef} className="mb-14">
        <h1 className="text-5xl text-center tracking-wide text-black/80 relative after:content-[''] after:w-[200px] after:block after:h-1 after:rounded-2xl after:bg-green-300 after:absolute after:left-1/2 after:transform after:-translate-x-1/2 after:bottom-[-15px]">
          Our Benefits
        </h1>
      </div>

      <div ref={tile1Ref} className="flex items-center bg-white shadow-lg max-w-[50%] mx-auto gap-x-4 h-[250px] rounded-3xl">
        <div ref={subTileSection1Ref} className="flex items-center justify-center opacity-0 w-0 gap-x-10">
          <div className="bg-black/80 rounded-full shadow-md text-white p-4 ml-7">
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
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center w-full h-full gap-y-3 my-auto ml-4">
            <h2 className="text-black/80 text-lg font-semibold text-left">Group Chats</h2>
            <p className="max-w-[500px]">
              Get started with ChatConnect in just a few steps. Our user-friendly setup ensures you’re chatting in no time.
            </p>
          </div>
        </div>
        <div
          ref={subTileLogo1Ref}
          className="gap-y-4 rounded-[30px] mx-auto bg-slate-50 w-full h-full flex flex-col items-center justify-center"
        >
          <h4 className="font-mont">We are here</h4>
          <h1 className="text-2xl font-poppins font-medium">Bring your favorite people together.</h1>
        </div>
      </div>

      <div
        ref={tile2Ref}
        className="flex items-center mt-14 bg-white shadow-lg max-w-[50%] mx-auto gap-x-4 h-[250px] rounded-3xl"
      >
        <div ref={subTileSection2Ref} className="flex items-center justify-center w-0 opacity-0 gap-x-10">
          <div className="bg-black/80 rounded-full shadow-md text-white p-4 ml-7">
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
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center w-full h-full gap-y-3 my-auto ml-4">
            <h2 className="text-black/80 text-lg font-semibold text-left">Secure Messaging</h2>
            <p className="max-w-[500px]">
              Your privacy is our top priority. With end-to-end encryption, your conversations stay between you and your contacts.
              Feel safe sharing your thoughts and moments.
            </p>
          </div>
        </div>
        <div
          ref={subTileLogo2Ref}
          className="gap-y-4 rounded-[30px] bg-slate-50 w-full h-full flex flex-col items-center justify-center"
        >
          <h4 className="font-mont">We are here</h4>
          <h1 className="text-2xl font-poppins font-medium">To ensure your messages are secure.</h1>
        </div>
      </div>

      <div
        ref={tile3Ref}
        className="flex items-center mt-14 bg-white shadow-lg max-w-[50%] mx-auto gap-x-4 h-[250px] rounded-3xl"
      >
        <div ref={subTileSection3Ref} className="flex items-center justify-center w-0 opacity-0 gap-x-10">
          <div className="bg-black/80 rounded-full shadow-md text-white p-4 ml-7">
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
                d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center w-full h-full gap-y-3 my-auto ml-4">
            <h2 className="text-black/80 text-lg font-semibold text-left">Customizable Themes</h2>
            <p className="max-w-[500px]">
              Personalize your chat experience with customizable themes and colors. Make your chat environment feel just right for
              you.
            </p>
          </div>
        </div>
        <div
          ref={subTileLogo3Ref}
          className="gap-y-4 rounded-[30px] bg-slate-50 w-full h-full flex flex-col items-center justify-center"
        >
          <h4 className="font-mont">We are here</h4>
          <h1 className="text-2xl font-poppins font-medium">Make it yours, make it unique.</h1>
        </div>
      </div>

      <div
        ref={tile4Ref}
        className="flex items-center mt-14 bg-white shadow-lg max-w-[50%] mx-auto gap-x-4 h-[250px] rounded-3xl"
      >
        <div ref={subTileSection4Ref} className="flex items-center justify-center w-0 opacity-0 gap-x-10">
          <div className="bg-black/80 rounded-full shadow-md text-white p-4 ml-7">
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
                d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center w-full h-full gap-y-3 my-auto ml-4">
            <h2 className="text-black/80 text-lg font-semibold text-left">Voice and Video Calls</h2>
            <p className="max-w-[500px]">
              Connect face-to-face or voice-to-voice with our high-quality call features. Perfect for catching up, planning, or
              just saying hi.
            </p>
          </div>
        </div>
        <div
          ref={subTileLogo4Ref}
          className="gap-y-4 rounded-[30px] bg-slate-50 w-full h-full flex flex-col items-center justify-center"
        >
          <h4 className="font-mont">We are here</h4>
          <h1 className="text-2xl font-poppins font-medium">Bring voices and smiles closer.</h1>
        </div>
      </div>
    </section>
  )
}

export default AppBenefits
