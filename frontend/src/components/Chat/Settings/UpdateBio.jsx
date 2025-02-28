import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "react-query"
import { bioSchema } from "../../../utils/zodSchema"
import { USER_PATHS } from "../../../constants/apiPaths"
import axiosInstance from "../../../utils/axiosInstance"

const UpdateBio = ({ currentBio }) => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bioSchema),
    defaultValues: { bio: currentBio }
  })

  const bio = watch("bio")
  const disableButton = !bio || bio === currentBio

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.patch(USER_PATHS.EDIT_PROFILE, data)
    },
    onSuccess: () => {
      console.log("Display Name Updated")
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const onSubmit = (data) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative mb-4">
      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
        Bio
      </label>
      <input
        id="bio"
        type="text"
        {...register("bio")}
        placeholder="Edit your bio"
        className="mt-1 block w-full border-b border-gray-300 py-2 text-sm"
      />
      {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
      <button
        isabled={disableButton}
        type="submit"
        className={`absolute right-2 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-custom-green ${disableButton ? "cursor-not-allowed" : "cursor-pointer"} text-center`}
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

export default UpdateBio
