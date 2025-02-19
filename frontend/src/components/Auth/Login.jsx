import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFields } from "../../utils/dynamicData"
import InputField from "../Shared/InputField"
import axiosInstance from "../../utils/axiosInstance"
import { useMutation } from "react-query"
import { AUTH_PATHS } from "../../constants/apiPaths"
import { loginSchema } from "../../utils/zodSchema"
import LoadingSpinner from "../Shared/LoadingSpinner"
import { useState } from "react"

const Login = ({ onButtonClick }) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const {
    register: login,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: async (credentials) => {
      return await axiosInstance.post(AUTH_PATHS.LOGIN, credentials)
    },
    onError: (error) => {
      setErrorMessage(error?.response?.data?.message || "An unexpected error occurred")
      console.error(error)
    }
  })

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="min-h-[480px] w-full rounded-lg bg-white px-4 py-6 tracking-wide shadow-lg">
        <div className="ml-8 flex flex-col gap-y-4">
          <h2 className="relative font-poppins text-[1.7rem] font-bold text-black/80 after:absolute after:-bottom-1 after:left-6 after:block after:h-1 after:w-[3rem] after:-translate-x-1/2 after:transform after:rounded-xl after:bg-dusty-grass after:content-['']">
            Login
          </h2>
          {errorMessage && <p className="font-poppins text-red-600">{errorMessage}</p>}
        </div>
        <div className="mx-auto flex w-[90%] flex-col items-center">
          <form onSubmit={handleSubmit(mutate)} className="w-full py-8 font-poppins">
            {loginFields.map((field) => {
              return (
                <InputField
                  key={field.id}
                  field={field}
                  register={login}
                  error={errors}
                  trigger={trigger}
                  clearErrors={clearErrors}
                />
              )
            })}
            <div className="my-4 flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <input
                  id="remember"
                  className="rounded-sm border border-slate-300 checked:bg-custom-green focus:border-transparent focus:ring-0 active:border active:border-custom-border lg:text-lg"
                  type="checkbox"
                />
                <label htmlFor="remember" className="cursor-pointer text-sm text-gray-500">
                  Remember me
                </label>
              </div>

              <div>
                <a href="#" className="text-sm text-gray-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="py-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded bg-button-color ${
                  isLoading
                    ? "cursor-not-allowed bg-dusty-grass"
                    : "bg-custom-green hover:bg-green-500 hover:transition-colors"
                } px-4 py-2 font-poppins font-semibold text-white shadow-md`}
              >
                {isLoading ? <LoadingSpinner loading={isLoading} loadingText={"Logging In"} finalText={"Login"} /> : "Login"}
              </button>
            </div>

            <div className="py-4 text-center">
              <p className="text-sm text-black/80">
                Not signed in yet?{" "}
                <span onClick={() => onButtonClick("Register")} className="cursor-pointer font-bold">
                  Sign up now!
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
