import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import ChatLogo from "@shared/components/ChatLogo"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@shared/utils/axiosInstance"
import { AUTH_PATHS } from "@shared/constants/apiPaths"
import LoadingSpinner from "@shared/components/LoadingSpinner"

const OtpAuthPage = ({ onButtonClick = () => {} }: { onButtonClick?: (value: string) => void }) => {
  const [otpValues, setOtpValues] = useState(Array(6).fill(""))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ otp, email }) => {
      return await axiosInstance.post(AUTH_PATHS.VERIFY_OTP, { otp, email })
    },
    onError: (error) => {
      if (import.meta.env.PROD) return
      console.error("OTP verification error:", error)
    }
  })

  const verifyOtp = () => {
    const email = localStorage.getItem("verificationEmail")
    const otp = otpValues.join("")
    if (otp.length !== 6) {
      alert("Please enter the complete 6-digit code.")
      return
    }

    mutate(
      { otp, email },
      {
        onSuccess: (response) => {
          console.log("OTP verified successfully!", response)
          onButtonClick("InfoForm")
        },
        onError: (error) => {
          if (import.meta.env.PROD) return
          console.error("OTP verification failed:", error)
          alert("OTP verification failed. Please try again.")
        }
      }
    )
  }

  const handleInputChange = (e, index) => {
    const { value } = e.target

    const updatedOtp = [...otpValues]
    updatedOtp[index] = value
    setOtpValues(updatedOtp)
    // console.log(updatedOtp)

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    const { value } = e.target
    if (e.key === "Backspace" && !value && index > 0) {
      inputRefs.current[index - 1].focus()
      const updatedOtp = [...otpValues]
      updatedOtp[index] = ""
      setOtpValues(updatedOtp)
      // console.log(updatedOtp)
    }
  }

  const handlePaste = (e, index) => {
    const pastedValue = e.clipboardData.getData("Text").slice(0, 6)
    const updatedOtp = [...otpValues]
    const newOtp = pastedValue.split("")

    updatedOtp.splice(index, newOtp.length, ...newOtp)
    setOtpValues(updatedOtp)

    if (newOtp.length === 6) {
      inputRefs.current[5].focus()
    } else {
      let nextIndex = index + newOtp.length
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex].focus()
      }
    }
    e.preventDefault()
  }

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  return (
    <div className="flex flex-col-reverse rounded-lg bg-white shadow-md">
      <div className="flex flex-col justify-center gap-y-7 p-8">
        <div className="flex">
          <ChatLogo size="size-5" />
          <h1 className="font-poppins ml-1 text-black/80">ChitChat</h1>
        </div>
        <div>
          <h1 className="font-poppins mb-4 text-2xl font-semibold">Verify your account</h1>
          <p className="font-mont mb-6 text-gray-600">Enter the verification code sent to your email.</p>
        </div>

        <div className="font-poppins mx-auto max-w-[95%]">
          <div className="mb-5 flex w-full justify-center gap-x-4">
            {Array(6)
              .fill("")
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  value={otpValues[index]}
                  onPaste={(e) => handlePaste(e, index)}
                  maxLength={1}
                  readOnly={index > 0 && otpValues[index - 1] === ""}
                  className={`size-12 rounded-lg border border-gray-300 ${
                    index > 0 && otpValues[index - 1] === "" ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"
                  } focus:border-custom-border text-center text-lg font-medium focus:ring-2 focus:outline-none`}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <div className="font-poppins mb-4 flex w-full justify-center">
            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className={`w-full ${
                isLoading
                  ? "bg-dusty-grass cursor-not-allowed"
                  : "bg-button-color hover:bg-green-500 hover:transition-colors"
              } rounded-md px-4 py-2 font-semibold text-white transition-colors duration-500`}
            >
              <LoadingSpinner loading={isLoading} loadingText="Please wait..." finalText="Confirm" size="size-5" />
            </button>
          </div>
        </div>

        <p className="font-poppins text-center text-gray-500">
          Haven’t received the email?{" "}
          <a href="#" className="text-custom-text font-semibold transition-colors duration-300 hover:text-green-500">
            Send again
          </a>
        </p>
      </div>
    </div>
  )
}

OtpAuthPage.propTypes = {
  onButtonClick: PropTypes.func
}

export default OtpAuthPage
