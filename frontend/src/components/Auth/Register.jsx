import React, { useState } from "react"
import { firstStepRegister, secondStepRegister } from "../../utils/dynamicData"

const Register = ({ onButtonClick }) => {
  const [step, setStep] = useState(1)
  const [avatar, setAvatar] = useState(null)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-[37.5rem] w-full rounded-lg bg-white px-4 py-7 tracking-wide shadow-lg">
        <div className={`flex justify-between`}>
          <div className="ml-8 flex flex-col gap-y-4">
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
          <form action="#" className={`w-full font-poppins ${step !== 3 ? "py-8" : ""}`}>
            <div
              className={`transform transition-opacity duration-1000 ease-in-out ${
                step === 1 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
              } flex w-full flex-col gap-y-2`}
            >
              {step === 1 && (
                <>
                  {firstStepRegister.map((field) => {
                    return (
                      <div
                        key={field.id}
                        className="mb-6 flex items-center border-b-[1px] border-gray-300 pb-1 focus-within:border-custom-border"
                      >
                        <div className="relative w-full">
                          <input
                            id={field.id}
                            className="peer ml-6 w-full border-custom-border px-3 py-2 text-gray-700 focus:outline-none focus:ring-0"
                            name={field.id}
                            type={field.type}
                            placeholder=" "
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="absolute left-0 top-2 h-6 w-6 text-gray-500 peer-focus:text-custom-text"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={field.iconPath} />
                          </svg>
                          <label
                            htmlFor={field.label}
                            className="pointer-events-none absolute left-9 top-2 -translate-y-8 scale-90 transform text-gray-600 transition-all duration-300 ease-out peer-placeholder-shown:left-9 peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-8 peer-focus:scale-90 peer-focus:text-custom-text"
                          >
                            {field.label}
                          </label>
                        </div>
                      </div>
                    )
                  })}

                  <div className="py-4">
                    <button
                      onClick={nextStep}
                      className="w-full rounded bg-button-color px-4 py-2 font-poppins font-semibold text-white shadow-md"
                    >
                      Next
                    </button>
                  </div>

                  <div className="py-4 text-center">
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
                      <div
                        key={field.id}
                        className="mb-6 flex items-center border-b-[1px] border-gray-300 pb-1 focus-within:border-custom-border"
                      >
                        <div className="relative w-full">
                          <input
                            id={field.id}
                            className="peer ml-6 w-full border-custom-border px-3 py-2 text-gray-700 focus:outline-none focus:ring-0"
                            name={field.id}
                            type={field.type}
                            placeholder=" "
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="absolute left-0 top-2 h-6 w-6 text-gray-500 peer-focus:text-custom-text"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={field.iconPath} />
                          </svg>
                          <label
                            htmlFor={field.label}
                            className="pointer-events-none absolute left-9 top-2 -translate-y-8 scale-90 transform text-gray-600 transition-all duration-300 ease-out peer-placeholder-shown:left-9 peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-8 peer-focus:scale-90 peer-focus:text-custom-text"
                          >
                            {field.label}
                          </label>
                        </div>
                      </div>
                    )
                  })}

                  <div className="py-4">
                    <button
                      onClick={nextStep}
                      className="w-full rounded bg-button-color px-4 py-2 font-poppins font-semibold text-white shadow-md"
                    >
                      Next
                    </button>
                  </div>

                  <div className="py-4 text-center">
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
              <div className={`mt-4 w-full px-4 ${step !== 3 ? "hidden" : ""}`}>
                <h3 className="mb-4 ml-2 text-black/80">Would you like to upload?</h3>
                <div className="mb-6 flex items-center justify-center">
                  <div className="overflow-none size-64 rounded-full border-2 border-slate-200">
                    {avatar ? (
                      <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="m-auto flex h-full items-center justify-center text-sm text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-y-3">
                  <div>
                    <label htmlFor="avatar" className="mb-2 block cursor-pointer font-medium text-gray-700">
                      <div className="flex items-center justify-between rounded-md bg-slate-50 px-4 py-2">
                        <span className="font-poppins text-sm">Choose an avatar</span>
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
                            d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                          />
                        </svg>
                      </div>
                    </label>
                    <input type="file" id="avatar" className="hidden" />
                  </div>
                  <div className="mt-4 flex max-w-[95%] flex-col items-center justify-between gap-y-4">
                    <button
                      className="ml-2 flex w-full items-center justify-center rounded-[4px] bg-dusty-grass py-2 font-semibold tracking-wider text-white"
                      type="submit"
                    >
                      <span>Submit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
