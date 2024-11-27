import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import tempImg from "../../assets/woman.jpg"
import tempImg1 from "../../assets/man.jpg"
import tempImg2 from "../../assets/female.jpg"

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

      // Animate card 1 to move back and card 2 to come forward
      .from(temp2Ref.current, {
        delay: 1,
        duration: 2,
        opacity: 0.4,
        ease: "elastic.out(1, 1)",
        top: "0",
        zIndex: 20
      })
      .to(temp1Ref.current, {
        top: "-55px",
        zIndex: 10,
        opacity: 0.5,
        scale: 0.9,
        ease: "elastic.out(1, 1)",
        backgroundColor: "#fff",
        duration: 2,
        x: 50,
        width: "95%"
      })
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
      .from(temp3Ref.current, {
        duration: 2,
        opacity: 0.4,
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
          ease: "back.out(1.7)",
          stagger: 0.15
        },
        "-=2"
      )

    return () => timeLine.kill()
  })

  return (
    <section className="flex flex-col items-center justify-center mx-auto min-h-screen bg-gray-50 mt-36 py-20">
      <h1 className="text-5xl text-center tracking-wide text-black/80 relative after:rounded-md after:block after:mt-2 after:w-[50%] after:h-1 after:bg-green-300 after:absolute after:left-1/2 after:transform after:-translate-x-1/2 after:bottom-[-18px]">
        Trusted By People
      </h1>

      <div className="mt-20 w-4/5 h-[400px] mx-auto relative flex flex-col gap-y-4">
        {/* Card 1 */}
        <div
          ref={temp1Ref}
          className="px-4 py-2 rounded-2xl absolute left-0 top-0 z-20 w-full h-[400px] gap-x-10 mx-auto shadow-lg bg-white flex items-center justify-center gap-y-4"
        >
          <div>
            <img className="rounded-2xl" src={tempImg} width={500} alt="" />
          </div>
          <div className="flex flex-col justify-center gap-y-6">
            <div>
              <h1 className="font-semibold font-poppins text-lg text-black/80">Customer Stories</h1>
            </div>
            <div>
              <p className="max-w-[500px] font-mont">
                We use Freshservice for everything, and that just makes it really easy—regardless of what you need as an
                employee—to know that you can always just go to this tool and you're going to get whatever you need.
              </p>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="font-semibold text-lg text-black/80">Elaira Steele</div>
              <div className="font-mont">System Administrator, Allbirds</div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          ref={temp2Ref}
          className="px-4 py-2 rounded-2xl shadow-lg absolute left-0 top-0 z-10 w-full h-[400px] mx-auto bg-white flex items-center justify-center gap-x-10 gap-y-4"
        >
          <div>
            <img className="rounded-2xl" src={tempImg1} width={500} alt="" />
          </div>
          <div className="flex flex-col justify-center gap-y-6">
            <div ref={temp2TitleRef}>
              <h1 className="font-semibold font-poppins text-lg text-black/80">Customer Stories</h1>
            </div>
            <div ref={temp2DetailRef}>
              <p className="max-w-[500px]">
                We use Freshservice for everything, and that just makes it really easy—regardless of what you need as an
                employee—to know that you can always just go to this tool and you're going to get whatever you need.
              </p>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="font-semibold text-lg text-black/80" ref={temp2NameRef}>
                Steve Jobs
              </div>
              <div className="font-mont" ref={temp2PostRef}>
                System Administrator, Allbirds
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          ref={temp3Ref}
          className="px-4 py-2 rounded-2xl shadow-lg absolute left-0 top-0 z-10 w-full h-[400px] mx-auto bg-white flex items-center justify-center gap-x-10 gap-y-4"
        >
          <div>
            <img className="rounded-2xl" src={tempImg2} width={500} alt="" />
          </div>
          <div className="flex flex-col justify-center gap-y-6">
            <div ref={temp3TitleRef}>
              <h1 className="font-semibold font-poppins text-lg text-black/80">Customer Stories</h1>
            </div>
            <div ref={temp3DetailRef}>
              <p className="max-w-[500px]">
                We use Freshservice for everything, and that just makes it really easy—regardless of what you need as an
                employee—to know that you can always just go to this tool and you're going to get whatever you need.
              </p>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="font-semibold text-lg text-black/80" ref={temp3NameRef}>
                Kaira Deeves
              </div>
              <div className="font-mont" ref={temp3PostRef}>
                System Administrator, Allbirds
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustedByPeople
