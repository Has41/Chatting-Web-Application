import { useEffect, useRef, useState } from "react"
import ChatLogo from "../components/Shared/ChatLogo"
import { useMutation } from "react-query"
import axiosInstance from "../utils/axiosInstance"
import { AUTH_PATHS } from "../constants/apiPaths"
import LoadingSpinner from "../components/Shared/LoadingSpinner"

const OtpAuthPage = ({ onButtonClick }) => {
  const [otpValues, setOtpValues] = useState(Array(6).fill(""))
  const inputRefs = useRef([])

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ otp, email }) => {
      return await axiosInstance.post(AUTH_PATHS.VERIFY_OTP, { otp, email })
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
    console.log(updatedOtp)

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
      console.log(updatedOtp)
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
          <h1 className="ml-1 font-poppins text-black/80">ChitChat</h1>
        </div>
        <div>
          <h1 className="mb-4 font-poppins text-2xl font-semibold">Verify your account</h1>
          <p className="mb-6 font-mont text-gray-600">Enter the verification code sent to your email.</p>
        </div>

        <div className="mx-auto max-w-[95%] font-poppins">
          <div className="mb-5 flex w-full justify-center gap-x-4">
            {Array(6)
              .fill("")
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={otpValues[index]}
                  onPaste={(e) => handlePaste(e, index)}
                  maxLength="1"
                  readOnly={index > 0 && otpValues[index - 1] === ""}
                  className={`size-12 rounded-lg border border-gray-300 ${
                    index > 0 && otpValues[index - 1] === "" ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"
                  } text-center text-lg font-medium focus:border-custom-border focus:outline-none focus:ring-2`}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <div className="mb-4 flex w-full justify-center font-poppins">
            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className={`w-full ${
                isLoading
                  ? "cursor-not-allowed bg-dusty-grass"
                  : "bg-button-color hover:bg-green-500 hover:transition-colors"
              } rounded-md px-4 py-2 font-semibold text-white transition-colors duration-500`}
            >
              <LoadingSpinner loading={isLoading} loadingText="Please wait..." finalText="Confirm" size="size-5" />
            </button>
          </div>
        </div>

        <p className="text-center font-poppins text-gray-500">
          Haven’t received the email?{" "}
          <a href="#" className="font-semibold text-custom-text transition-colors duration-300 hover:text-green-500">
            Send again
          </a>
        </p>
      </div>
    </div>
  )
}

export default OtpAuthPage
