import React from "react"
import { useMutation } from "react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { genderSchema } from "../../../utils/zodSchema"
import { USER_PATHS } from "../../../constants/apiPaths"
import axiosInstance from "../../../utils/axiosInstance"

const UpdateGender = ({ currentGender }) => {
  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(genderSchema),
    defaultValues: { gender: currentGender }
  })

  const selectedGender = watch("gender")

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.patch(USER_PATHS.EDIT_PROFILE, data)
    },
    onSuccess: () => {
      console.log("Gender Updated")
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const onSubmit = (data) => {
    mutate(data)
  }

  const genders = [
    { label: "Male", value: "Male", icon: "M12 6V4m0 0V4m0 2a4 4 0 100 8 4 4 0 100-8zM6 20h12" },
    { label: "Female", value: "Female", icon: "M12 4a4 4 0 014 4 4 4 0 01-8 0 4 4 0 014-4zm0 6v6m-4 0h8" },
    { label: "Other", value: "Prefer not to say", icon: "M12 6V4m0 0V4m0 2a4 4 0 100 8 4 4 0 100-8zM6 20h12" }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Gender</label>
      <div className="mt-2 flex gap-4">
        {genders.map((gender) => (
          <button
            key={gender.value}
            type="button"
            onClick={() => {
              setValue("gender", gender.value)
            }}
            className={`flex items-center justify-center rounded-lg text-sm ${
              selectedGender === gender.value ? "border-custom-green bg-custom-green/20 p-2" : "border-gray-300 bg-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={gender.icon} />
            </svg>
            {gender.label}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="mt-4 flex items-center gap-2 rounded-full bg-custom-green px-4 py-2 text-center"
        aria-label="Save Interest"
      >
        <span className="text-sm font-semibold text-white">Save</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
      </button>

      {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
    </form>
  )
}

export default UpdateGender
