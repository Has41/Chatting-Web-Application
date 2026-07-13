import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import countryList from "react-select-country-list"
import { locationSchema } from "@shared/utils/zodSchema"
import { useUpdateProfileMutation } from "@profile/queries/profileQueries"

interface UpdateLocationProps {
  currentLocation?: string
}

interface LocationFormData {
  location: string
}

interface CountryOption {
  value: string
  label: string
}

const UpdateLocation = ({ currentLocation = "" }: UpdateLocationProps) => {
  const options = useMemo(() => countryList().getData(), [])
  const currentCountry = useMemo(() => {
    const found = options.find((option: CountryOption) => option.label === currentLocation || option.value === currentLocation)
    return found?.label || currentLocation
  }, [currentLocation, options])

  const {
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: { location: currentCountry }
  })

  useEffect(() => {
    reset({ location: currentCountry })
  }, [currentCountry, reset])

  const location = watch("location")
  const disableButton = !location || location === currentCountry

  const { mutate } = useUpdateProfileMutation()

  const onSubmit = (data: LocationFormData) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative mb-4">
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
        Location
      </label>
      <select id="location" {...register("location")} className="mt-1 block w-full border-b border-gray-300 p-2 text-sm">
        <option value="">Select your country</option>
        {options.map((option: CountryOption) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
      <button
        type="submit"
        disabled={disableButton}
        className={`bg-custom-green absolute top-6 right-1 flex size-8 items-center justify-center rounded-full text-center ${disableButton ? "cursor-not-allowed" : "cursor-pointer"}`}
        aria-label="Save location"
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
