import { useForm } from "react-hook-form"
import { firstStepRegister } from "../../utils/dynamicData"
import { useMutation } from "react-query"
import axiosInstance from "../../utils/axiosInstance"
import InputField from "../Shared/InputField"
import { AUTH_PATHS } from "../../constants/apiPaths"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../../utils/zodSchema"
import LoadingSpinner from "../Shared/LoadingSpinner"

const Register = ({ onButtonClick }) => {
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

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      return await axiosInstance.post(AUTH_PATHS.REGISTER, formData)
    },
    onSuccess: ({ data }) => {
      reset()
      localStorage.setItem("verificationEmail", data?.user.email)
      localStorage.setItem("newUser", data?.user.username)
      localStorage.setItem("userId", data?.user.id)
      onButtonClick("OtpPage")
    },
    onError: (error) => {
      if (import.meta.env.PROD) return
      console.error("Registration error:", error)
    }
  })

  const onRegister = async (data) => {
    const isValid = await trigger()
    if (!isValid) {
      return
    }
    mutate(data)
  }

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
        </div>

        <div className="mx-auto flex w-[90%] flex-col items-center">
          <form onSubmit={handleSubmit(onRegister)} className="w-full font-poppins">
            <div className="flex w-full transform flex-col gap-y-2 transition-opacity duration-1000 ease-in-out">
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
                    type="submit"
                    className={`w-full ${
                      isLoading
                        ? "cursor-not-allowed bg-dusty-grass"
                        : "bg-button-color hover:bg-green-500 hover:transition-colors"
                    } rounded px-4 py-2 font-poppins font-semibold text-white shadow-md`}
                  >
                    <LoadingSpinner loading={isLoading} loadingText="Please wait..." finalText="Register" size="size-5" />
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
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
