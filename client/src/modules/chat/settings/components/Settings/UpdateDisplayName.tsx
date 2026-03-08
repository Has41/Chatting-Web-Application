import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { displayNameSchema } from "@shared/utils/zodSchema"
import axiosInstance from "@shared/utils/axiosInstance"
import { USER_PATHS } from "@shared/constants/apiPaths"

interface UpdateDisplayNameProps {
  currentDisplayName?: string
}

interface DisplayNameFormData {
  displayName: string
}

const UpdateDisplayName = ({ currentDisplayName = "" }: UpdateDisplayNameProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(displayNameSchema),
    defaultValues: { displayName: currentDisplayName }
  })

  const { mutate } = useMutation({
    mutationFn: async (data: DisplayNameFormData) => {
      return await axiosInstance.patch(USER_PATHS.EDIT_PROFILE, data)
    },
    onSuccess: () => {
      console.log("Display Name Updated")
    },
    onError: (error: unknown) => {
      console.error(error)
    }
  })

  const onSubmit = (data: DisplayNameFormData) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative mb-4">
      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
        Display Name
      </label>
      <input
        id="displayName"
        type="text"
        {...register("displayName")}
        placeholder="Enter your display name"
        className="mt-1 block w-full border-b border-gray-300 py-2 text-sm"
      />
      {errors.displayName && <p className="mt-1 text-xs text-red-500">{String(errors.displayName.message || "")}</p>}
      <button
        type="submit"
        className="bg-custom-green absolute top-6 right-2 flex h-8 w-8 items-center justify-center rounded-full text-center"
        aria-label="Add Interest"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
      </button>
    </form>
  )
}

export default UpdateDisplayName
