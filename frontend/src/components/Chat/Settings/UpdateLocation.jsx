import React, { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "react-query"
import countryList from "react-select-country-list"
import { locationSchema } from "../../../utils/zodSchema"
import axiosInstance from "../../../utils/axiosInstance"
import { USER_PATHS } from "../../../constants/apiPaths"

const UpdateLocation = ({ currentLocation }) => {
  const options = useMemo(() => countryList().getData(), [])
  const defaultCountry = useMemo(() => {
    const found = options.find((option) => option.label === currentLocation)
    return found ? found.value : ""
  }, [currentLocation, options])

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: { location: defaultCountry }
  })
  const location = watch("location")
  const disableButton = !location || location === defaultCountry

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.patch(USER_PATHS.EDIT_PROFILE, data)
    },
    onSuccess: () => {
      console.log("Location Updated")
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
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
        Location
      </label>
      <select id="location" {...register("location")} className="mt-1 block w-full border-b border-gray-300 p-2 text-sm">
        <option value="">Select your country</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
      <button
        type="submit"
        disabled={disableButton}
        className={`absolute right-1 top-6 flex size-8 items-center justify-center rounded-full bg-custom-green text-center ${disableButton ? "cursor-not-allowed" : "cursor-pointer"}`}
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

export default UpdateLocation
