import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import sectionImage from "../../assets/whiteBG.jpeg"
import { IntroCard } from "../../utils/Cards"

const IntroSection = () => {
  const introRef = useRef()
  const textRef = useRef()
  const titleRef = useRef()
  const mainImageRef = useRef()
  const card1Ref = useRef()
  const card2Ref = useRef()
  const card3Ref = useRef()
  const card4Ref = useRef()

  gsap.registerPlugin(ScrollTrigger)

  useGSAP(() => {
    const timeLine = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
      scrollTrigger: {
        trigger: introRef.current,
        start: "top 40%",
        end: "bottom top"
        // markers: true
      }
    })

    const allRefs = [
      introRef.current,
      textRef.current,
      titleRef.current,
      mainImageRef.current,
      card1Ref.current,
      card2Ref.current,
      card3Ref.current,
      card4Ref.current
    ]

    const cardRefs = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current]

    timeLine
      .set(
        allRefs.filter((ref) => ref !== introRef.current),
        { opacity: 0, display: "none" }
      )
      .to(introRef.current, {
        opacity: 1,
        duration: 1,
        display: "block",
        ease: "elastic.out(1, 1)"
      })
      .to(introRef.current, { opacity: 0, duration: 1, delay: 2 })
      .set(allRefs, { opacity: 0, display: "none" })
      .to(textRef.current, {
        opacity: 1,
        display: "block",
        scale: 1.2,
        duration: 1,
        ease: "elastic.out(1, 1)"
      })
      .to(textRef.current, { opacity: 0, duration: 1, delay: 2 })
      .set(allRefs, { opacity: 0, display: "none" })
      .to(titleRef.current, {
        opacity: 1,
        display: "block",
        scale: 1.2,
        duration: 1,
        ease: "elastic.out(1, 1)"
      })
      .to(titleRef.current, { opacity: 0, duration: 1, delay: 2 })
      .set([introRef.current, textRef.current, titleRef.current], {
        opacity: 0,
        display: "none"
      })
      .to(mainImageRef.current, {
        opacity: 1,
        duration: 1,
        display: "block",
        ease: "elastic.out(2, 1.5)"
      })
      .to(mainImageRef.current, { opacity: 1, display: "flex", duration: 1 })
      // Showing cards one by one
      .set([card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current], { opacity: 0, display: "block" })
      .to(cardRefs, {
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 1)",
        stagger: 0.8 // Adjust the stagger time as needed
      })

    return () => timeLine.kill()
  })

  return (
    <section className="font-poppins mb-8 flex flex-col items-center justify-center w-full h-[80vh] m-auto bg-slate-50">
      <div ref={introRef}>
        <h3 className="text-2xl max-w-[700px]">
          Stay connected <span className="bg-green-200 px-1 rounded-xl">with friends and family</span>
          anytime, anywhere. Chat, share, and express yourself effortlessly
        </h3>
      </div>
      <div ref={textRef}>
        <p className="max-w-[800px] text-xl tracking-wide">
          ChatConnect is designed to make communication seamless and fun. Whether you're catching up with old friends or making
          new ones, our app provides a <span className="bg-green-200 px-1 rounded-xl">secure and user-friendly platform</span> to
          stay connected!
        </p>
      </div>
      <div ref={titleRef}>
        <h1 className="text-4xl">
          Introducing The <span className="bg-green-200 px-1 rounded-xl">Chat Connect</span> Of The Future!
        </h1>
      </div>
      <div className="flex items-center justify-center gap-x-5 font-poppins">
        <div className="flex flex-col items-center justify-center gap-y-40">
          <IntroCard
            cardRef={card1Ref}
            icon={
              "M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            }
            title={"User-Friendly Interface"}
            description={"Navigate effortlessly with our clean and intuitive design."}
          />
          <IntroCard
            cardRef={card2Ref}
            icon={
              "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            }
            title={"Secure Messaging"}
            description={"Your privacy is our priority. Enjoy encrypted chats and data protection."}
          />
        </div>
        <div ref={mainImageRef}>
          <img className="rounded-lg shadow-lg" width={400} src={sectionImage} alt="Img" />
        </div>
        <div className="flex flex-col items-center justify-center gap-y-40">
          <IntroCard
            cardRef={card3Ref}
            icon={
              "M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
            }
            title={"Cross-Platform"}
            description={"Stay connected across all your devices – mobile, tablet, and desktop."}
          />
          <IntroCard
            cardRef={card4Ref}
            icon={
              "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            }
            title={"Status Updates"}
            description={"Share your current mood or activities with status updates that disappear after 24 hours"}
          />
        </div>
      </div>
    </section>
  )
}

export default IntroSection
