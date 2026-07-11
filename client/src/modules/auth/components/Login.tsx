import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFields } from "@shared/utils/dynamicData"
import InputField from "@shared/components/InputField"
import axiosInstance from "@shared/api/api-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AUTH_PATHS, CONVERSATION_PATHS } from "@shared/constants/apiPaths"
import { loginSchema } from "@shared/utils/zodSchema"
import LoadingSpinner from "@shared/components/LoadingSpinner"
import { useState } from "react"
import useAuth from "@auth/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import type { AuthSwitchProps, LoginFormData } from "@auth/types/forms"
import type { AxiosError } from "axios"

const Login = ({ onButtonClick }: AuthSwitchProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { setIsAuthenticated, setUser, refetch } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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
    mutationFn: async (credentials: LoginFormData) => {
      return await axiosInstance.post(AUTH_PATHS.LOGIN, credentials)
    },
    onSuccess: async () => {
      setErrorMessage(null)
      const currentUser = await refetch()
      if (currentUser.data) {
        setUser(currentUser.data)
      }
      setIsAuthenticated(true)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [CONVERSATION_PATHS.GET_CONVERSATIONS_OF_USER] }),
        queryClient.invalidateQueries({ queryKey: ["friendConversations"] })
      ])
      navigate("/chat")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setErrorMessage(error?.response?.data?.message ?? "An unexpected error occurred")
      setIsAuthenticated(false)
      setUser(null)
      if (import.meta.env.PROD) return
      console.error(error)
    }
  })

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="min-h-[480px] w-full rounded-lg bg-white px-4 py-6 tracking-wide shadow-lg">
        <div className="ml-8 flex flex-col gap-y-4">
          <h2 className="font-poppins after:bg-dusty-grass relative text-[1.7rem] font-bold text-black/80 after:absolute after:-bottom-1 after:left-6 after:block after:h-1 after:w-[3rem] after:-translate-x-1/2 after:transform after:rounded-xl after:content-['']">
            Login
          </h2>
          {errorMessage && <p className="font-poppins text-red-600">{errorMessage}</p>}
        </div>
        <div className="mx-auto flex w-[90%] flex-col items-center">
          <form onSubmit={handleSubmit(mutate)} className="font-poppins w-full py-8">
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
                  className="checked:bg-custom-green active:border-custom-border rounded-sm border border-slate-300 focus:border-transparent focus:ring-0 active:border lg:text-lg"
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
                className={`bg-button-color w-full rounded ${
                  isLoading
                    ? "bg-dusty-grass cursor-not-allowed"
                    : "bg-custom-green hover:bg-green-500 hover:transition-colors"
                } font-poppins px-4 py-2 font-semibold text-white shadow-md`}
              >
                {isLoading ? <LoadingSpinner loading={isLoading} loadingText={"Logging In"} finalText={"Login"} /> : "Login"}
              </button>
            </div>

            <div className="py-4 text-center">
              <p className="text-sm text-black/80">
                Not signed in yet?{" "}
                <button
                  type="button"
                  onClick={() => onButtonClick?.("Register")}
                  className="cursor-pointer bg-transparent p-0 font-bold"
                >
                  Sign up now!
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
