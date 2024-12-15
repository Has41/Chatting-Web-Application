import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import tempImg from "../../assets/woman.jpg"
import tempImg1 from "../../assets/man.jpg"
import tempImg2 from "../../assets/female.jpg"
import { CustomerCard } from "../../utils/Cards"

const TrustedByPeople = () => {
  const tempRefs = {
    temp1Ref: useRef(null),
    temp2Ref: useRef(null),
    temp2TitleRef: useRef(null),
    temp2DetailRef: useRef(null),
    temp2NameRef: useRef(null),
    temp2PostRef: useRef(null),
    temp3Ref: useRef(null),
    temp3TitleRef: useRef(null),
    temp3DetailRef: useRef(null),
    temp3NameRef: useRef(null),
    temp3PostRef: useRef(null)
  }

  const {
    temp1Ref,
    temp2Ref,
    temp2TitleRef,
    temp2DetailRef,
    temp2NameRef,
    temp2PostRef,
    temp3Ref,
    temp3TitleRef,
    temp3DetailRef,
    temp3NameRef,
    temp3PostRef
  } = tempRefs

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
    <section className="mx-auto mt-36 flex min-h-screen flex-col items-center justify-center bg-gray-50 py-20">
      <h1 className="relative text-center text-5xl tracking-wide text-black/80 after:absolute after:bottom-[-18px] after:left-1/2 after:mt-2 after:block after:h-1 after:w-[50%] after:-translate-x-1/2 after:transform after:rounded-md after:bg-green-300">
        Trusted By People
      </h1>

      <div className="relative mx-auto mt-20 flex h-[400px] w-4/5 flex-col gap-y-4">
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
