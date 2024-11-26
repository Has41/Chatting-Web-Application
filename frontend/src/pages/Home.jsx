import React, { useRef } from "react"
import mainImage from "../assets/listen-music.jpg"
import sectionImage from "../assets/whiteBG.jpeg"
import chatVideo from "../assets/sectionVid.mp4"
import tempImg from "../assets/woman.jpg"
import tempImg1 from "../assets/man.jpg"
import tempImg2 from "../assets/female.jpg"
import firstOperator from "../assets/operator1.jpg"
import secondOperator from "../assets/operator2.jpg"
import thirdOperator from "../assets/operator3.jpg"
import fourthOperator from "../assets/operator4.jpg"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import gsap from "gsap"

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const introRef = useRef()
  const textRef = useRef()
  const titleRef = useRef()
  const mainImageRef = useRef()
  const card1Ref = useRef()
  const card2Ref = useRef()
  const card3Ref = useRef()
  const card4Ref = useRef()
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

  //For better memory management || Good practice
  // const { contextSafe } = useGSAP({ scope: containerRef })

  useGSAP(() => {
    const timeLine = gsap.timeline({
      scrollTrigger: {
        trigger: introRef.current,
        start: "top 40%",
        end: "bottom top",
        onEnter: () => timeLine.restart(),
        onEnterBack: () => timeLine.restart()
        // markers: true
      }
    })

    timeLine
      .set(
        [
          textRef.current,
          titleRef.current,
          mainImageRef.current,
          card1Ref.current,
          card2Ref.current,
          card3Ref.current,
          card4Ref.current
        ],
        { opacity: 0, display: "none" }
      )
      .to(introRef.current, {
        opacity: 1,
        duration: 1,
        display: "block",
        ease: "elastic.out(1, 1)"
      })
      .to(introRef.current, { opacity: 0, duration: 1, delay: 2 })
      .set(
        [
          introRef.current,
          titleRef.current,
          mainImageRef.current,
          card1Ref.current,
          card2Ref.current,
          card3Ref.current,
          card4Ref.current
        ],
        { opacity: 0, display: "none" }
      )
      .to(textRef.current, {
        opacity: 1,
        display: "block",
        scale: 1.2,
        duration: 1,
        ease: "elastic.out(1, 1)"
      })
      .to(textRef.current, { opacity: 0, duration: 1, delay: 2 })
      .set(
        [
          introRef.current,
          textRef.current,
          mainImageRef.current,
          card1Ref.current,
          card2Ref.current,
          card3Ref.current,
          card4Ref.current
        ],
        { opacity: 0, display: "none" }
      )
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
      .to(card1Ref.current, {
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 1)"
      })
      .to(card2Ref.current, {
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 1)"
      })
      .to(card3Ref.current, {
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 1)"
      })
      .to(card4Ref.current, {
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 1)"
      })

    return () => timeLine.kill()
  })

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
    <main>
      <div className="h-screen">
        <nav className="flex items-center justify-between mx-auto py-8 w-[90%] font-poppins text-black/80">
          <h1 className="text-xl">ChitChat</h1>
          <div>
            <ul className="flex items-center justify-center text-black/80 gap-x-6 bg-slate-50 px-6 py-1 rounded-2xl">
              <li>About</li>
              <li>Benefits</li>
              <li>App</li>
              <li>Features</li>
              <li>Reviews</li>
            </ul>
          </div>
          <div>
            <button className="px-2 py-1 rounded-3xl bg-slate-100 flex items-center justify-center gap-x-2 font-medium">
              <div className="pl-1">Get Started</div>
              <div className="bg-green-300 rounded-full p-[9px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 text-black/80"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </button>
          </div>
        </nav>
        <main className="flex items-center justify-center w-[90%] mx-auto gap-x-10 mt-14">
          <div>
            <h1 className="text-[48px] font-medium font-mont">
              Empower Connections With <span className="text-green-400 font-semibold">ChitChat</span>
            </h1>
            <p className="break-all max-w-[700px] mt-4">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est ut pariatur odit expedita reprehenderit aliquam
              asperiores harum eligendi ab quae.
            </p>
            <div className="mt-10 flex gap-x-6">
              <button className="px-2 py-1 rounded-3xl bg-black/90 text-white flex items-center justify-center gap-x-2">
                <div className="pl-1">Try Out</div>
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
              <button className="px-3 py-1 font-semibold rounded-3xl bg-slate-100 flex items-center justify-center gap-x-2">
                <div>Learn More</div>
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
          <div>
            <img width={800} height={1500} src={mainImage} className="shadow-md" />
          </div>
        </main>
      </div>

      <div className="font-poppins mb-8 flex flex-col items-center justify-center w-full h-[80vh] m-auto bg-slate-50">
        <div ref={introRef}>
          <h3 className="text-2xl max-w-[700px]">
            Stay connected <span className="bg-green-200 px-1 rounded-xl">with friends and family</span>
            anytime, anywhere. Chat, share, and express yourself effortlessly
          </h3>
        </div>
        <div ref={textRef}>
          <p className="max-w-[800px] text-xl tracking-wide">
            ChatConnect is designed to make communication seamless and fun. Whether you're catching up with old friends or making
            new ones, our app provides a <span className="bg-green-200 px-1 rounded-xl">secure and user-friendly platform</span>{" "}
            to stay connected!
          </p>
        </div>
        <div ref={titleRef}>
          <h1 className="text-4xl">
            Introducing The <span className="bg-green-200 px-1 rounded-xl">Chat Connect</span> Of The Future!
          </h1>
        </div>
        <div className="flex items-center justify-center gap-x-5 font-poppins">
          <div className="flex flex-col items-center justify-center gap-y-40">
            <div ref={card1Ref} className="flex flex-col gap-y-1 bg-white p-4 rounded-md shadow-md">
              <div className="flex items-center gap-x-2">
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
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
                <h2 className="font-semibold text-black/80">User-Friendly Interface</h2>
              </div>
              <div className="pl-4 pt-2">
                <p className="max-w-[350px] text-[15px] text-black/80">
                  Navigate effortlessly with our clean and intuitive design.
                </p>
              </div>
            </div>
            <div ref={card2Ref} className="flex flex-col gap-y-1 bg-white p-4 rounded-md shadow-md">
              <div className="flex items-center gap-x-2">
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
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
                <h2 className="font-semibold text-black/80">Secure Messaging</h2>
              </div>
              <div className="pl-4 pt-2">
                <p className="max-w-[350px] text-[15px] text-black/80">
                  Your privacy is our priority. Enjoy encrypted chats and data protection.
                </p>
              </div>
            </div>
          </div>
          <div ref={mainImageRef}>
            <img className="rounded-lg shadow-lg" width={400} src={sectionImage} alt="Img" />
          </div>
          <div className="flex flex-col items-center justify-center gap-y-40">
            <div ref={card3Ref} className="flex flex-col gap-y-1 bg-white p-4 rounded-md shadow-md">
              <div className="flex items-center gap-x-2">
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
                    d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                  />
                </svg>
                <h2 className="font-semibold text-black/80">Cross-Platform</h2>
              </div>
              <div className="pl-4 pt-2">
                <p className="max-w-[350px] text-[15px] text-black/80">
                  Stay connected across all your devices – mobile, tablet, and desktop.
                </p>
              </div>
            </div>
            <div ref={card4Ref} className="flex flex-col gap-y-1 bg-white p-4 rounded-md shadow-md">
              <div className="flex items-center gap-x-2">
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <h2 className="font-semibold text-black/80">Status Updates</h2>
              </div>
              <div className="pl-4 pt-2">
                <p className="max-w-[350px] text-[15px] text-black/80">
                  Share your current mood or activities with status updates that disappear after 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20">
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
                Your privacy is our top priority. With end-to-end encryption, your conversations stay between you and your
                contacts. Feel safe sharing your thoughts and moments.
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
                Personalize your chat experience with customizable themes and colors. Make your chat environment feel just right
                for you.
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
      </div>

      <div className="flex items-center justify-center gap-x-32 w-[80%] my-4 mx-auto py-4 rounded-3xl bg-slate-50">
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-4xl font-mont ml-2">24/7 Availability</h1>
            <h1 className="text-4xl font-poppins bg-green-200 px-3 py-2 rounded-3xl">Always Online, Always Connected</h1>
          </div>
          <p className="max-w-[500px]">
            Your privacy is our top priority. With end-to-end encryption, your conversations stay between you and your contacts.
            Feel safe sharing your thoughts and moments.
          </p>
          <div className="flex gap-x-4">
            <div className="bg-white p-3 rounded-full shadow-md">
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
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            </div>
            <div className="bg-white p-3 rounded-full shadow-md">
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
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                />
              </svg>
            </div>
            <div className="bg-white p-3 rounded-full shadow-md">
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <video className="rounded-2xl" width="300" loop autoPlay muted>
            <source src={chatVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mx-auto min-h-screen bg-gray-50 mt-36 py-20">
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
      </div>

      <div>
        <div className="flex flex-col justify-center gap-y-36 shadow-sm overflow-y-hidden font-poppins bg-slate-50 w-[95%] h-[900px] mx-auto mt-20 px-4 rounded-xl">
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
        </div>
      </div>

      <div className="flex items-center justify-between px-10 py-8 font-poppins">
        <div className="text-black/80">
          <span>&copy;</span> 2024.
        </div>
        <div className="flex gap-x-4 text-black/80 text-sm">
          <div>Terms Of Use</div>
          <div>Help Center</div>
        </div>
      </div>
    </main>
  )
}

export default Home
