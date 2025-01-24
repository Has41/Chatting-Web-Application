import React, { useState, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Login from "../components/Auth/Login"
import Register from "../components/Auth/Register"

const GetStarted = () => {
  const [currentForm, setCurrentForm] = useState("Login")
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const formPickerRefs = {
    greenSectionRef: useRef(null),
    greenSectionTextRef: useRef(null),
    subGreenSectionRef: useRef(null),
    formContainerRef: useRef(null),
    isFirstRender: useRef(true)
  }

  const { greenSectionRef, greenSectionTextRef, subGreenSectionRef, formContainerRef, isFirstRender } = formPickerRefs

  const handleFormSwitch = (formSwitch) => {
    setCurrentForm(formSwitch)
    setShouldAnimate(true)
  }

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!shouldAnimate) return

    const timeLine = gsap.timeline()

    if (currentForm === "Register") {
      timeLine
        .set(greenSectionTextRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" })
        .to(greenSectionRef.current, {
          width: "100%",
          duration: 1,
          left: "-50%",
          borderTopLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          ease: "power2.inOut"
        })
        .to(greenSectionTextRef.current, { duration: 0, opacity: 1, paddingBottom: "25%", ease: "power2.inOut" })
        .to(
          subGreenSectionRef.current,
          {
            borderBottomRightRadius: "0px",
            borderTopLeftRadius: "0px",
            left: 0,
            bottom: 0,
            duration: 1,
            ease: "power2.inOut"
          },
          "-=1"
        )
        .to(greenSectionRef.current, {
          width: "34%",
          left: 0,
          right: "auto",
          bottom: 0,
          top: 0,
          duration: 1,
          borderBottomRightRadius: "9999px",
          ease: "power2.inOut"
        })
        .to(
          subGreenSectionRef.current,
          {
            borderBottomRightRadius: "9999px",
            duration: 1,
            ease: "power2.inOut"
          },
          "-=1"
        )
        .set(formContainerRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" }, "-=2")
        .set(formContainerRef.current, { opacity: 1, duration: 2, ease: "power2.inOut" })
        .to(formContainerRef.current, { marginLeft: "55%", duration: 1 }, "-=1")
    }

    if (currentForm === "Login") {
      timeLine
        .set(greenSectionTextRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" })
        .to(greenSectionRef.current, {
          width: "100%",
          duration: 1,
          ease: "power2.inOut"
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

    // Reset animation trigger
    setShouldAnimate(false)

    return () => timeLine.kill()
  }, [currentForm, shouldAnimate]) // Add shouldAnimate to dependency array

  return (
    <section className="bg-custom-white relative flex h-screen w-full items-center overflow-hidden">
      <div
        ref={greenSectionRef}
        className="absolute bottom-0 right-0 top-0 flex w-1/2 items-center justify-center rounded-tl-full bg-dusty-grass shadow-lg"
      >
        <h1 ref={greenSectionTextRef} className="relative z-10 pb-[10%] text-center text-5xl font-bold text-white">
          {currentForm === "Register" ? "Join With Us!" : "Welcome Back!"}
        </h1>
        <div
          ref={subGreenSectionRef}
          className="absolute bottom-0 left-0 h-[150%] w-[150%] rounded-tl-full bg-dusty-grass shadow-lg"
        />
      </div>
      <div ref={formContainerRef} className="ml-[10%] w-full max-w-[430px]">
        {currentForm === "Login" ? (
          <Login onButtonClick={() => handleFormSwitch("Register")} />
        ) : (
          <Register onButtonClick={() => handleFormSwitch("Login")} />
        )}
      </div>
    </section>
  )
}

export default GetStarted
