import React, { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { otherDetailSchema } from "../../utils/zodSchema"
import InputField from "../Shared/InputField"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useMutation } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import { AUTH_PATHS } from "../../constants/apiPaths"
import LoadingSpinner from "../Shared/LoadingSpinner"

const InfoForm = ({ onButtonClick }) => {
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dayOptions, setDayOptions] = useState(Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0")))
  const [step, setStep] = useState(0)
  const [_, setDirection] = useState("next")
  const containerRef = useRef(null)
  const {
    register,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(otherDetailSchema)
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      return await axiosInstance.post(AUTH_PATHS.OTHER_DETAIL, formData)
    }
  })

  const displayNameField = {
    id: "displayName",
    label: "Display Name",
    type: "text",
    iconPath:
      "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  }

  const dateOfBirthField = {
    id: "dateOfBirth",
    label: "Date Of Birth",
    type: "date",
    iconPath:
      "M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
  }

  const bioField = {
    id: "bio",
    label: "Bio",
    type: "text",
    iconPath:
      "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
  }

  const handleNext = async () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection("next")
    setStep((prev) => Math.min(prev + 1, 2))
    setTimeout(() => setIsTransitioning(false), 600)
  }

  const handleBack = () => {
    setDirection("back")
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = (data) => {
    let userId = localStorage.getItem("userId")
    const dateOfBirth = new Date(`${selectedYear}-${selectedMonth}-${selectedDay}T00:00:00Z`)
    const formData = { ...data, dateOfBirth, userId }

    mutate(formData, {
      onSuccess: (response) => {
        console.log("Other details added successfully!", response)
        onButtonClick("ProfileForm")
      },
      onError: (error) => {
        console.error("Error updating details:", error)
      }
    })
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <InputField
            register={register}
            error={errors}
            field={displayNameField}
            trigger={trigger}
            clearErrors={clearErrors}
          />
        )
      case 1:
        return (
          <InputField
            register={register}
            dayOptions={dayOptions}
            setDayOptions={setDayOptions}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            error={errors}
            field={dateOfBirthField}
            trigger={trigger}
            clearErrors={clearErrors}
          />
        )
      case 2:
        return <InputField register={register} error={errors} field={bioField} trigger={trigger} clearErrors={clearErrors} />
      default:
        return null
    }
  }

  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power1.out" })
    }
  }, [step])

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="min-h-[80%] w-full rounded-lg bg-white px-6 py-6 tracking-wide shadow-lg">
        <div className="flex justify-between">
          <div className="ml-8 flex flex-col gap-y-4 py-6">
            <h2 className="relative font-poppins text-[1.7rem] font-bold text-black/80 after:absolute after:-bottom-1 after:left-6 after:block after:h-1 after:w-[3rem] after:-translate-x-1/2 after:transform after:rounded-xl after:bg-dusty-grass after:content-['']">
              Additional Information
            </h2>
            <p className="font-poppins text-gray-600">Sign up your details</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full font-poppins">
          <div ref={containerRef}>
            {renderStep()}
            <div className="mt-6 flex justify-between gap-x-6">
              {step > 0 && (
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={handleBack}
                  className="w-full rounded bg-button-color px-4 py-2 font-poppins font-semibold text-white shadow-md"
                >
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={handleNext}
                  className="w-full rounded bg-button-color px-4 py-2 font-poppins font-semibold text-white shadow-md"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isTransitioning}
                  className="w-full rounded bg-button-color px-4 py-2 font-poppins font-semibold text-white shadow-md"
                >
                  <LoadingSpinner loading={isLoading} loadingText="Please wait..." finalText="Confirm" size="size-5" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InfoForm
