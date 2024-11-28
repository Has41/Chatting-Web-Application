import React, { useState } from "react"
import { firstStepRegister, secondStepRegister } from "../../utils/DynamicData"

const Register = ({ onButtonClick }) => {
  const [step, setStep] = useState(1)
  const [avatar, setAvatar] = useState(null)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-lg w-full h-[37.5rem] py-7 px-4 bg-white rounded-lg tracking-wide">
        <div className={`flex justify-between`}>
          <div className="ml-8 flex flex-col gap-y-4">
            <h2 className="text-[1.7rem] font-bold font-poppins text-black/80 relative after:content-[''] after:w-[3rem] after:block after:h-1 after:rounded-xl after:bg-dusty-grass after:absolute after:left-6 after:transform after:-translate-x-1/2 after:-bottom-1">
              Register
            </h2>
            <p className="font-poppins text-gray-600">Sign up your details</p>
          </div>
          {(step === 2 || step === 3) && (
            <div className="mr-4 flex items-center justify-between max-w-[90%] mt-2">
              <svg
                onClick={prevStep}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7 cursor-pointer hover:text-custom-text transition-all duration-300"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center mx-auto w-[90%]">
          <form action="#" className={`w-full font-poppins ${step !== 3 ? "py-8" : ""}`}>
            <div
              className={`transition-opacity duration-1000 ease-in-out transform ${
                step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
              } w-full flex flex-col gap-y-2`}
            >
              {step === 1 && (
                <>
                  {firstStepRegister.map((field) => {
                    return (
                      <div
                        key={field.id}
                        className="flex items-center border-b-[1px] border-gray-300 focus-within:border-custom-border mb-6 pb-1"
                      >
                        <div className="relative w-full">
                          <input
                            id={field.id}
                            className="px-3 py-2 peer w-full ml-6 text-gray-700 focus:outline-none focus:ring-0 border-custom-border"
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
                            className="w-6 h-6 text-gray-500 absolute left-0 top-2 peer-focus:text-custom-text"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={field.iconPath} />
                          </svg>
                          <label
                            htmlFor={field.label}
                            className="absolute left-9 top-2 transition-all duration-300 ease-out transform scale-90 -translate-y-8 text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:left-9 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-8 peer-focus:scale-90 peer-focus:text-custom-text pointer-events-none"
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
                      className="w-full shadow-md px-4 py-2 bg-button-color font-poppins text-white rounded font-semibold"
                    >
                      Next
                    </button>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-sm text-black/80">
                      Already have an account?{" "}
                      <span onClick={() => onButtonClick("Login")} className="font-bold cursor-pointer">
                        Log in!
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
            <div
              className={`transition-opacity duration-1000 ease-in-out transform ${
                step === 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              } w-full flex flex-col gap-y-2`}
            >
              {step === 2 && (
                <>
                  {secondStepRegister.map((field) => {
                    return (
                      <div
                        key={field.id}
                        className="flex items-center border-b-[1px] border-gray-300 focus-within:border-custom-border mb-6 pb-1"
                      >
                        <div className="relative w-full">
                          <input
                            id={field.id}
                            className="px-3 py-2 peer w-full ml-6 text-gray-700 focus:outline-none focus:ring-0 border-custom-border"
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
                            className="w-6 h-6 text-gray-500 absolute left-0 top-2 peer-focus:text-custom-text"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={field.iconPath} />
                          </svg>
                          <label
                            htmlFor={field.label}
                            className="absolute left-9 top-2 transition-all duration-300 ease-out transform scale-90 -translate-y-8 text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:left-9 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-8 peer-focus:scale-90 peer-focus:text-custom-text pointer-events-none"
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
                      className="w-full shadow-md px-4 py-2 bg-button-color font-poppins text-white rounded font-semibold"
                    >
                      Next
                    </button>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-sm text-black/80">
                      Already have an account?{" "}
                      <span onClick={() => onButtonClick("Login")} className="font-bold cursor-pointer">
                        Log in!
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>

            <div
              className={`transition-opacity duration-1000 ease-in-out transform ${
                step === 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              } flex items-center justify-center w-full h-full`}
            >
              <div className={`px-4 mt-4 w-full ${step !== 3 ? "hidden" : ""}`}>
                <h3 className="mb-4 ml-2 text-black/80">Would you like to upload?</h3>
                <div className="mb-6 flex items-center justify-center">
                  <div className="size-64 rounded-full overflow-none border-2 border-slate-200">
                    {avatar ? (
                      <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center m-auto h-full text-sm text-slate-400">
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
                    <label htmlFor="avatar" className="block text-gray-700 font-medium mb-2 cursor-pointer">
                      <div className="bg-slate-50 rounded-md py-2 px-4 flex items-center justify-between">
                        <span className="text-sm font-poppins">Choose an avatar</span>
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
                  <div className="flex flex-col items-center justify-between max-w-[95%] mt-4 gap-y-4">
                    <button
                      className="bg-dusty-grass rounded-[4px] flex items-center justify-center w-full font-semibold tracking-wider py-2 text-white ml-2"
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
