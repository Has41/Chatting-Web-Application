import React, { useState, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Login from "../components/Login"
import Register from "../components/Register"

const GetStarted = () => {
  const [currentForm, setCurrentForm] = useState("Register")
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const greenSectionRef = useRef(null)
  const greenSectionTextRef = useRef(null)
  const subGreenSectionRef = useRef(null)
  const formContainerRef = useRef(null)
  const isFirstRender = useRef(true)

  const handleFormSwitch = (formSwitch) => {
    setCurrentForm(formSwitch)
    setShouldAnimate(true)
  }

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!shouldAnimate) {
      return
    }

    const timeLine = gsap.timeline()

    if (currentForm === "Register") {
      timeLine
        .set(greenSectionTextRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" })
        .to(greenSectionRef.current, {
          width: "100%",
          duration: 1,
          ease: "power2.inOut",
          onStart: () => {
            greenSectionRef.current.style.left = "0" // Ensure initial position
          }
        })
        .set(greenSectionTextRef.current, { opacity: 1, duration: 2, paddingBottom: "10%", ease: "power2.inOut" })
        .to(greenSectionRef.current, {
          width: "50%",
          left: "50%",
          bottom: 0,
          top: 0,
          borderBottomRightRadius: "0px",
          borderTopLeftRadius: "9999px",
          duration: 1,
          ease: "power2.inOut"
        })
        .set(formContainerRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" }, "-=2")
        .to(
          subGreenSectionRef.current,
          {
            left: 0,
            bottom: 0,
            borderBottomRightRadius: "0px",
            borderTopLeftRadius: "9999px",
            duration: 1,
            ease: "power2.inOut"
          },
          "-=1"
        )
        .set(formContainerRef.current, { opacity: 1, duration: 2, ease: "power2.inOut" })
        .to(formContainerRef.current, { marginLeft: "10%", duration: 1 }, "-=1")
    }

    if (currentForm === "Login") {
      timeLine
        .set(greenSectionTextRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" })
        .to(greenSectionRef.current, {
          width: "100%",
          duration: 1,
          left: "-50%",
          borderBottomRightRadius: "9999px",
          borderTopLeftRadius: "0px",
          ease: "power2.inOut"
        })
        .set(greenSectionTextRef.current, { duration: 2, opacity: 1, paddingBottom: "25%", ease: "power2.inOut" })
        .to(
          subGreenSectionRef.current,
          {
            borderBottomRightRadius: "9999px",
            borderTopLeftRadius: "0px",
            left: 0,
            bottom: 0,
            duration: 1,
            ease: "power2.inOut"
          },
          "-=2"
        )
        .to(greenSectionRef.current, {
          width: "34%",
          left: 0,
          right: "auto",
          bottom: 0,
          top: 0,
          duration: 1,
          ease: "power2.inOut"
        })
        .set(formContainerRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" }, "-=2")
        .set(formContainerRef.current, { opacity: 1, duration: 2, ease: "power2.inOut" })
        .to(formContainerRef.current, { marginLeft: "55%", duration: 1 }, "-=1")
    }

    // Reset animation trigger
    setShouldAnimate(false)

    return () => timeLine.kill()
  }, [currentForm, shouldAnimate]) // Add shouldAnimate to dependency array

  return (
    <section className="flex items-center relative h-screen w-full overflow-hidden">
      <div
        ref={greenSectionRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-dusty-grass shadow-lg flex items-center justify-center rounded-tl-full"
      >
        <h1 ref={greenSectionTextRef} className="relative text-white text-center text-5xl font-bold z-10 pb-[10%]">
          {currentForm === "Register" ? "Join With Us!" : "Welcome Back!"}
        </h1>
        <div
          ref={subGreenSectionRef}
          className="absolute shadow-lg bottom-0 left-0 bg-dusty-grass rounded-tl-full h-[150%] w-[150%]"
        />
      </div>
      <div ref={formContainerRef} className="w-full max-w-[430px] ml-[10%]">
        {currentForm === "Register" ? (
          <Register onButtonClick={() => handleFormSwitch("Login")} />
        ) : (
          <Login onButtonClick={() => handleFormSwitch("Register")} />
        )}
      </div>
    </section>
  )
}

export default GetStarted
