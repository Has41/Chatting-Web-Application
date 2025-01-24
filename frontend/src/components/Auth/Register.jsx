import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { firstStepRegister, secondStepRegister } from "../../utils/dynamicData"
import { useMutation } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import InputField from "../Shared/InputField"
import ProfileUpload from "../Shared/ProfileUpload"
import { AUTH_PATHS } from "../../constants/apiPaths"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../../utils/zodSchema"

const Register = ({ onButtonClick }) => {
  const [step, setStep] = useState(1)
  const [avatar, setAvatar] = useState(null)
  const {
    register,
    clearErrors,
    handleSubmit,
    reset,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const nextStep = async () => {
    // if (step === 1) {
    //   const isValid = await trigger()
    //   if (!isValid) {
    //     return
    //   }
    // }
    setStep(step + 1)
  }
  const prevStep = () => setStep(step - 1)

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      return await axiosInstance.post(AUTH_PATHS.REGISTER, formData)
    }
  })

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="min-h-[80%] w-full rounded-lg bg-white px-4 tracking-wide shadow-lg">
        <div className={`flex justify-between`}>
          <div className="ml-8 flex flex-col gap-y-4 py-6">
            <h2 className="relative font-poppins text-[1.7rem] font-bold text-black/80 after:absolute after:-bottom-1 after:left-6 after:block after:h-1 after:w-[3rem] after:-translate-x-1/2 after:transform after:rounded-xl after:bg-dusty-grass after:content-['']">
              Register
            </h2>
            <p className="font-poppins text-gray-600">Sign up your details</p>
          </div>
          {(step === 2 || step === 3) && (
            <div className="mr-4 mt-2 flex max-w-[90%] items-center justify-between">
              <svg
                onClick={prevStep}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7 cursor-pointer transition-all duration-300 hover:text-custom-text"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
            </div>
          )}
        </div>

        <div className="mx-auto flex w-[90%] flex-col items-center">
          <form action="#" className="w-full font-poppins">
            <div
              className={`transform transition-opacity duration-1000 ease-in-out ${
                step === 1 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
              } flex w-full flex-col gap-y-2`}
            >
              {step === 1 && (
                <>
                  {firstStepRegister.map((field) => {
                    return (
                      <InputField
                        field={field}
                        error={errors}
                        register={register}
                        trigger={trigger}
                        clearErrors={clearErrors}
                      />
                    )
                  })}
                  <div>
                    <button
                      onClick={nextStep}
                      type="button"
                      className="w-full rounded bg-button-color px-4 py-2 font-poppins font-semibold text-white shadow-md"
                    >
                      Next
                    </button>
                  </div>

                  <div className="py-6 text-center">
                    <p className="text-sm text-black/80">
                      Already have an account?{" "}
                      <span onClick={() => onButtonClick("Login")} className="cursor-pointer font-bold">
                        Log in!
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
            <div
              className={`transform transition-opacity duration-1000 ease-in-out ${
                step === 2 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              } flex w-full flex-col gap-y-2`}
            >
              {step === 2 && (
                <>
                  {secondStepRegister.map((field) => {
                    return (
                      <InputField
                        field={field}
                        error={errors}
                        register={register}
                        trigger={trigger}
                        clearErrors={clearErrors}
                      />
                    )
                  })}

                  <div>
                    <button
                      onClick={nextStep}
                      type="button"
                      className="w-full rounded bg-button-color px-4 py-2 font-poppins font-semibold text-white shadow-md"
                    >
                      Next
                    </button>
                  </div>

                  <div className="py-6 text-center">
                    <p className="text-sm text-black/80">
                      Already have an account?{" "}
                      <span onClick={() => onButtonClick("Login")} className="cursor-pointer font-bold">
                        Log in!
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>

            <div
              className={`transform transition-opacity duration-1000 ease-in-out ${
                step === 3 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              } flex h-full w-full items-center justify-center`}
            >
              <div className={`w-full px-4 ${step !== 3 ? "hidden" : ""}`}>
                <h3 className="mb-4 ml-2 text-black/80">Would you like to upload?</h3>
                <ProfileUpload avatar={avatar} register={register} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
