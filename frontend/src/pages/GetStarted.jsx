import { useState, useRef, useCallback } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Login from "../components/Auth/Login"
import Register from "../components/Auth/Register"
import InfoForm from "../components/Auth/InfoForm"
import ProfileUpload from "../components/Auth/ProfileUpload"
import OtpAuthPage from "./OtpAuthPage"

const GetStarted = () => {
  const [currentForm, setCurrentForm] = useState(localStorage.getItem("currentForm") || "Login")
  const shouldAnimateRef = useRef(false)

  const formPickerRefs = {
    greenSectionRef: useRef(null),
    greenSectionTextRef: useRef(null),
    subGreenSectionRef: useRef(null),
    formContainerRef: useRef(null),
    isFirstRender: useRef(true)
  }

  const { greenSectionRef, greenSectionTextRef, subGreenSectionRef, formContainerRef, isFirstRender } = formPickerRefs

  const handleFormSwitch = useCallback((formSwitch) => {
    setCurrentForm(formSwitch)
    localStorage.setItem("currentForm", formSwitch)
    shouldAnimateRef.current = true
  }, [])

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (
      !greenSectionRef.current ||
      !greenSectionTextRef.current ||
      !subGreenSectionRef.current ||
      !formContainerRef.current
    ) {
      shouldAnimateRef.current = false
      return
    }
    if (!shouldAnimateRef.current) return

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
    } else if (currentForm === "Login") {
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
    } else if (currentForm === "InfoForm" || currentForm === "OtpPage" || currentForm === "ProfileForm") {
      timeLine
        .set(greenSectionTextRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" })
        .to(greenSectionRef.current, {
          width: "100%",
          duration: 1,
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
            duration: 2,
            ease: "power2.inOut"
          },
          "-=1"
        )
        .set(formContainerRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" }, "-=2")
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

    shouldAnimateRef.current = false

    return () => timeLine.kill()
  }, [currentForm])

  return (
    <section className="relative flex h-screen w-full items-center overflow-hidden bg-custom-white">
      {currentForm === "Login" ? (
        <>
          <div
            ref={greenSectionRef}
            className="absolute bottom-0 right-0 top-0 flex w-1/2 items-center justify-center rounded-tl-full bg-dusty-grass shadow-lg"
          >
            <h1
              ref={greenSectionTextRef}
              className="relative z-10 select-none pb-[10%] text-center text-5xl font-bold text-white"
            >
              Welcome Back!
            </h1>
            <div
              ref={subGreenSectionRef}
              className="absolute bottom-0 left-0 size-[150%] rounded-tl-full bg-dusty-grass shadow-lg"
            />
          </div>
          <div ref={formContainerRef} className="ml-[10%] w-full max-w-[430px]">
            <Login onButtonClick={handleFormSwitch} />
          </div>
        </>
      ) : (
        <>
          <div
            ref={greenSectionRef}
            className="absolute bottom-0 right-auto top-0 flex w-[34%] items-center justify-center rounded-br-full bg-dusty-grass shadow-lg"
          >
            <h1
              ref={greenSectionTextRef}
              className="relative z-10 select-none pb-[10%] text-center text-5xl font-bold text-white"
            >
              Join With Us!
            </h1>
            <div
              ref={subGreenSectionRef}
              className="absolute bottom-0 left-0 size-[150%] rounded-br-full bg-dusty-grass shadow-lg"
            />
          </div>
          <div ref={formContainerRef} className="ml-[55%] w-full max-w-[430px]">
            {currentForm === "Register" && <Register onButtonClick={handleFormSwitch} />}
            {currentForm === "OtpPage" && <OtpAuthPage onButtonClick={handleFormSwitch} />}
            {currentForm === "InfoForm" && <InfoForm onButtonClick={handleFormSwitch} />}
            {currentForm === "ProfileForm" && <ProfileUpload />}
          </div>
        </>
      )}
    </section>
  )
}

export default GetStarted
