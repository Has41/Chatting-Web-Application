import React, { useState } from "react"
import { firstStepRegister, secondStepRegister } from "../utils/dynamicData"

const Register = ({ onButtonClick }) => {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-lg w-full h-[570px] py-7 px-4 bg-white rounded-lg tracking-wide">
        <div className="ml-8 flex flex-col gap-y-4">
          <h2 className="text-[1.7rem] font-bold font-poppins text-black/80 relative after:content-[''] after:w-[3rem] after:block after:h-1 after:rounded-xl after:bg-dusty-grass after:absolute after:left-6 after:transform after:-translate-x-1/2 after:-bottom-1">
            Register
          </h2>
          <p className="font-poppins text-gray-600">Sign up your details</p>
        </div>
        <div className="flex flex-col items-center mx-auto w-[90%]">
          <form action="#" className="w-full font-poppins py-8">
            {step === 1 && (
              <>
                {firstStepRegister.map((field) => {
                  return (
                    <div
                      key={field.id}
                      className="flex items-center border-b-[1px] border-gray-300 focus-within:border-custom-border mb-6 pb-2"
                    >
                      <div className="relative w-full">
                        <input
                          id="username"
                          className="px-3 py-2 peer w-full ml-6 text-gray-700 focus:outline-none focus:ring-0 border-custom-border"
                          name="username"
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
                          htmlFor="username"
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

            {step === 2 && (
              <>
                {secondStepRegister.map((field) => {
                  return (
                    <div
                      key={field.id}
                      className="flex items-center border-b-[1px] border-gray-300 focus-within:border-custom-border mb-6 pb-2"
                    >
                      <div className="relative w-full">
                        <input
                          id="username"
                          className="px-3 py-2 peer w-full ml-6 text-gray-700 focus:outline-none focus:ring-0 border-custom-border"
                          name="username"
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
                          htmlFor="username"
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
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
