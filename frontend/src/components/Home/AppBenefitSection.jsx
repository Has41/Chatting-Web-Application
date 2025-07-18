import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SlidingCard } from "../Shared/Cards"

const AppBenefits = () => {
  const tileRefs = {
    containerRef: useRef(null),
    tile1Ref: useRef(null),
    subTileLogo1Ref: useRef(null),
    subTileSection1Ref: useRef(null),
    tile2Ref: useRef(null),
    subTileLogo2Ref: useRef(null),
    subTileSection2Ref: useRef(null),
    tile3Ref: useRef(null),
    subTileLogo3Ref: useRef(null),
    subTileSection3Ref: useRef(null),
    tile4Ref: useRef(null),
    subTileLogo4Ref: useRef(null),
    subTileSection4Ref: useRef(null)
  }

  const {
    containerRef,
    tile1Ref,
    subTileLogo1Ref,
    subTileSection1Ref,
    tile2Ref,
    subTileLogo2Ref,
    subTileSection2Ref,
    tile3Ref,
    subTileLogo3Ref,
    subTileSection3Ref,
    tile4Ref,
    subTileLogo4Ref,
    subTileSection4Ref
  } = tileRefs

  gsap.registerPlugin(ScrollTrigger)

  useGSAP(() => {
    const timeLine = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 50%",
        end: () => `bottom+=${tile4Ref.current.offsetTop + tile4Ref.current.offsetHeight - containerRef.current.offsetTop}`,
        once: true
        // markers: true
      }
    })

    timeLine
      //1st tile Animation
      .to([subTileSection1Ref.current], { duration: 0.8, width: "55%" })
      .to(tile1Ref.current, { duration: 0.8, maxWidth: "90%" }, "-=1")
      .to(subTileLogo1Ref.current, { duration: 0.8, width: "45%" }, "-=1")
      .to([subTileSection1Ref.current], { opacity: 0.8 })

      //2nd tile Animation
      .to([subTileSection2Ref.current], { duration: 0.8, width: "55%" })
      .to(tile2Ref.current, { duration: 0.8, maxWidth: "90%" }, "-=1")
      .to(subTileLogo2Ref.current, { duration: 0.8, width: "45%" }, "-=1")
      .to([subTileSection2Ref.current], { opacity: 0.8 })

      //3rd tile Animation
      .to([subTileSection3Ref.current], { duration: 0.8, width: "55%" })
      .to(tile3Ref.current, { duration: 0.8, maxWidth: "90%" }, "-=1")
      .to(subTileLogo3Ref.current, { duration: 0.8, width: "45%" }, "-=1")
      .to([subTileSection3Ref.current], { opacity: 0.8 })

      //4th tile Animation
      .to([subTileSection4Ref.current], { duration: 0.8, width: "55%" })
      .to(tile4Ref.current, { duration: 0.8, maxWidth: "90%" }, "-=1")
      .to(subTileLogo4Ref.current, { duration: 0.8, width: "45%" }, "-=1")
      .to([subTileSection4Ref.current], { opacity: 0.8 })
  })

  return (
    <section className="py-20">
      <div ref={containerRef} className="mb-14">
        <h1 className="relative text-center text-5xl tracking-wide text-black/80 after:absolute after:bottom-[-15px] after:left-1/2 after:block after:h-1 after:w-[200px] after:-translate-x-1/2 after:transform after:rounded-2xl after:bg-green-300 after:content-['']">
          Our Benefits
        </h1>
      </div>
      <div className="flex max-w-full flex-col gap-y-14">
        <SlidingCard
          tileRef={tile1Ref}
          subTileSectionRef={subTileSection1Ref}
          iconPath={`M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z`}
          tileName={"Group Chats"}
          tileDetail={`Get started with ChatConnect in just a few steps. Our user-friendly setup ensures you're chatting in no time.`}
          subTileLogoRef={subTileLogo1Ref}
          tileQuote={"Bring your favorite people together."}
        />

        <SlidingCard
          tileRef={tile2Ref}
          subTileSectionRef={subTileSection2Ref}
          iconPath={`M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z`}
          tileName={"Secure Messaging"}
          tileDetail={`Your privacy is our top priority. With end-to-end encryption, your conversations stay between you and your contacts. Feel safe sharing your thoughts and moments.`}
          subTileLogoRef={subTileLogo2Ref}
          tileQuote={"To ensure your messages are secure."}
        />

        <SlidingCard
          tileRef={tile3Ref}
          subTileSectionRef={subTileSection3Ref}
          iconPath={`M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3`}
          tileName={"Customizable Themes"}
          tileDetail={`Personalize your chat experience with customizable themes and colors. Make your chat environment feel just right for you.`}
          subTileLogoRef={subTileLogo3Ref}
          tileQuote={"Make it yours, make it unique."}
        />

        <SlidingCard
          tileRef={tile4Ref}
          subTileSectionRef={subTileSection4Ref}
          iconPath={`M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z`}
          tileName={"Voice and Video Calls"}
          tileDetail={`Connect face-to-face or voice-to-voice with our high-quality call features. Perfect for catching up, planning, or just saying hi.`}
          subTileLogoRef={subTileLogo4Ref}
          tileQuote={"Bring voices and smiles closer."}
        />
      </div>
    </section>
  )
}

export default AppBenefits
