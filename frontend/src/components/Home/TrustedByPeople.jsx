import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import tempImg from "../../assets/woman.jpg"
import tempImg1 from "../../assets/man.jpg"
import tempImg2 from "../../assets/female.jpg"
import { CustomerCard } from "../../utils/Cards"

const TrustedByPeople = () => {
  const temp1Ref = useRef()
  const temp2Ref = useRef()
  let temp2TitleRef = useRef()
  let temp2DetailRef = useRef()
  let temp2NameRef = useRef()
  let temp2PostRef = useRef()
  const temp3Ref = useRef()
  let temp3TitleRef = useRef()
  let temp3DetailRef = useRef()
  let temp3NameRef = useRef()
  let temp3PostRef = useRef()

  useGSAP(() => {
    const timeLine = gsap.timeline({ repeat: -1, repeatDelay: 1 })

    timeLine
      // Initial setup: hide cards 2 and 3, ensure zIndex is set
      .set([temp2Ref.current, temp3Ref.current], { opacity: 0, zIndex: 0 })
      .set(temp1Ref.current, { zIndex: 20 })
      // Animate card 1 to move back and card 2 to come forward
      .to(temp2Ref.current, {
        delay: 1,
        duration: 2,
        opacity: 1,
        ease: "elastic.out(1, 1)",
        top: "0",
        zIndex: 20
      })
      .to(
        temp1Ref.current,
        {
          top: "-55px",
          zIndex: 10,
          opacity: 0.7,
          scale: 0.9,
          ease: "elastic.out(1, 1)",
          backgroundColor: "#fff",
          delay: 0.5,
          duration: 2,
          x: 50,
          width: "95%"
        },
        "-=2"
      )
      .fromTo(
        [temp2TitleRef.current, temp2DetailRef.current, temp2NameRef.current, temp2PostRef.current],
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          stagger: 0.15
        },
        "-=2"
      )

      // Set explicit zIndex for card 3 before animating it
      .set(temp3Ref.current, { zIndex: 20 })

      // Transition from card 2 to card 3
      .to(temp2Ref.current, { zIndex: 10 })
      .to(temp3Ref.current, {
        duration: 2,
        opacity: 1,
        ease: "elastic.out(1, 1)",
        top: "0"
      })
      .to(
        temp2Ref.current,
        {
          top: "-55px",
          zIndex: 5,
          opacity: 0.5,
          scale: 0.9,
          backgroundColor: "#fff",
          ease: "elastic.out(1, 1)",
          duration: 2,
          x: 50,
          width: "95%"
        },
        "-=2"
      )
      .set(temp1Ref.current, { zIndex: 0 })
      .fromTo(
        [temp3TitleRef.current, temp3DetailRef.current, temp3NameRef.current, temp3PostRef.current],
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.5)",
          stagger: 0.15
        },
        "-=2"
      )
      .set([temp1Ref.current, temp2Ref.current, temp3Ref.current], { delay: 1, clearProps: "all" })

    return () => timeLine.kill()
  })

  return (
    <section className="flex flex-col items-center justify-center mx-auto min-h-screen bg-gray-50 mt-36 py-20">
      <h1 className="text-5xl text-center tracking-wide text-black/80 relative after:rounded-md after:block after:mt-2 after:w-[50%] after:h-1 after:bg-green-300 after:absolute after:left-1/2 after:transform after:-translate-x-1/2 after:bottom-[-18px]">
        Trusted By People
      </h1>

      <div className="mt-20 w-4/5 h-[400px] mx-auto relative flex flex-col gap-y-4">
        <CustomerCard tempRef={temp1Ref} tempImg={tempImg} tempTopic={"Customer Stories"} tempName={"Elaira Steele"} />
        <CustomerCard
          tempRef={temp2Ref}
          tempImg={tempImg1}
          tempTitleRef={temp2TitleRef}
          tempDetailRef={temp2DetailRef}
          tempNameRef={temp2NameRef}
          tempPostRef={temp2PostRef}
          tempTopic={"Customer Stories"}
          tempName={"Steve Jobs"}
        />
        <CustomerCard
          tempRef={temp3Ref}
          tempImg={tempImg2}
          tempTitleRef={temp3TitleRef}
          tempDetailRef={temp3DetailRef}
          tempNameRef={temp3NameRef}
          tempPostRef={temp3PostRef}
          tempTopic={"Customer Stories"}
          tempName={"Kaira Deeves"}
        />
      </div>
    </section>
  )
}

export default TrustedByPeople
