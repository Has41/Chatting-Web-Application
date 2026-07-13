import { useEffect, useReducer, useRef, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from "react"
import ChatLogo from "@shared/components/ChatLogo"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@shared/api/api-client"
import { AUTH_PATHS, USER_PATHS } from "@shared/constants/apiPaths"
import LoadingSpinner from "@shared/components/LoadingSpinner"
import type { AuthSwitchProps } from "@auth/types/forms"

interface OtpState {
  values: string[]
  focusIndex: number | null
}

type OtpAction =
  | { type: "input"; index: number; value: string }
  | { type: "backspace"; index: number }
  | { type: "paste"; index: number; value: string }

const OTP_LENGTH = 6

const otpReducer = (state: OtpState, action: OtpAction): OtpState => {
  if (action.type === "input") {
    const values = [...state.values]
    values[action.index] = action.value

    return {
      values,
      focusIndex: action.value.length === 1 && action.index < OTP_LENGTH - 1 ? action.index + 1 : null
    }
  }

  if (action.type === "backspace") {
    const values = [...state.values]
    values[action.index] = ""

    return {
      values,
      focusIndex: action.index - 1
    }
  }

  const values = [...state.values]
  const newOtp = action.value.split("")
  values.splice(action.index, newOtp.length, ...newOtp)

  return {
    values: values.slice(0, OTP_LENGTH),
    focusIndex: newOtp.length >= OTP_LENGTH ? OTP_LENGTH - 1 : Math.min(action.index + newOtp.length, OTP_LENGTH - 1)
  }
}

const OtpAuthPage = ({ onButtonClick }: AuthSwitchProps) => {
  const queryClient = useQueryClient()
  const [{ values: otpValues, focusIndex }, dispatchOtp] = useReducer(otpReducer, {
    values: Array(OTP_LENGTH).fill(""),
    focusIndex: 0
  })
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async ({ otp, email }: { otp: string; email: string | null }) => {
      return await axiosInstance.post(AUTH_PATHS.VERIFY_OTP, { otp, email })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_PATHS.GET_INFO] })
    },
    onError: (error: unknown) => {
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
        onSuccess: (response: unknown) => {
          console.log("OTP verified successfully!", response)
          onButtonClick?.("InfoForm")
        },
        onError: (error: unknown) => {
          if (import.meta.env.PROD) return
          console.error("OTP verification failed:", error)
          alert("OTP verification failed. Please try again.")
        }
      }
    )
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.currentTarget

    dispatchOtp({ type: "input", index, value })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const { value } = e.currentTarget
    if (e.key === "Backspace" && !value && index > 0) {
      dispatchOtp({ type: "backspace", index })
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault()
    const pastedValue = e.clipboardData.getData("Text").slice(0, 6)
    dispatchOtp({ type: "paste", index, value: pastedValue })
  }

  useEffect(() => {
    if (focusIndex === null) return
    inputRefs.current[focusIndex]?.focus()
  }, [focusIndex])

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
                  aria-label={`Verification code digit ${index + 1}`}
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
              type="button"
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

export default OtpAuthPage
