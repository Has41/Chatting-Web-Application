import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { genderSchema } from "@shared/utils/zodSchema"
import { useUpdateProfileMutation } from "@profile/queries/profileQueries"
import type { ProfileGender } from "@profile/types/profile"

interface UpdateGenderProps {
  currentGender?: string
}

interface GenderFormData {
  gender: ProfileGender
}

const GENDERS = [
  { label: "Male", value: "Male", icon: "M12 6V4m0 0V4m0 2a4 4 0 100 8 4 4 0 100-8zM6 20h12" },
  { label: "Female", value: "Female", icon: "M12 4a4 4 0 014 4 4 4 0 01-8 0 4 4 0 014-4zm0 6v6m-4 0h8" },
  { label: "Other", value: "Prefer not to say", icon: "M12 6V4m0 0V4m0 2a4 4 0 100 8 4 4 0 100-8zM6 20h12" }
] as const

const UpdateGender = ({ currentGender = "" }: UpdateGenderProps) => {
  const normalizedGender = ["Male", "Female", "Prefer not to say"].includes(currentGender)
    ? (currentGender as GenderFormData["gender"])
    : "Prefer not to say"

  const {
    setValue,
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<GenderFormData>({
    resolver: zodResolver(genderSchema),
    defaultValues: { gender: normalizedGender }
  })

  useEffect(() => {
    reset({ gender: normalizedGender })
  }, [normalizedGender, reset])

  const selectedGender = useWatch({ control, name: "gender" })
  const disableButton = selectedGender === normalizedGender

  const { mutate } = useUpdateProfileMutation()

  const onSubmit = (data: GenderFormData) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <p className="block text-sm font-medium text-gray-700">Gender</p>
      <div className="mt-2 flex gap-4">
        {GENDERS.map((gender) => (
          <button
            key={gender.value}
            type="button"
            aria-pressed={selectedGender === gender.value}
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
        disabled={disableButton}
        className={`bg-custom-green mt-4 flex items-center gap-2 rounded-full px-4 py-2 text-center ${disableButton ? "cursor-not-allowed" : "cursor-pointer"}`}
        aria-label="Save gender"
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

      {errors.gender && <p className="mt-1 text-xs text-red-500">{String(errors.gender.message || "")}</p>}
    </form>
  )
}

export default UpdateGender
