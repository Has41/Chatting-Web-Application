import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { USER_PATHS } from "@shared/constants/apiPaths"
import axiosInstance from "@shared/api/api-client"
import useAuth from "@auth/hooks/useAuth"

const dateOfBirthSchema = z.object({
  day: z.string().nonempty("Day is required"),
  month: z.string().nonempty("Month is required"),
  year: z.string().nonempty("Year is required")
})

type DateOfBirthFormData = z.infer<typeof dateOfBirthSchema>

interface UpdateDateOfBirthProps {
  currentDateOfBirth?: string
}

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 121 }, (_, i) => CURRENT_YEAR - i)

const UpdateDateOfBirth = ({ currentDateOfBirth }: UpdateDateOfBirthProps) => {
  const { refetch } = useAuth()
  const currentFormattedDate = currentDateOfBirth?.split("T")[0] ?? ""
  const defaultValues = useMemo(() => {
    const [year = "", month = "", day = ""] = currentFormattedDate.split("-")
    return { day, month, year }
  }, [currentFormattedDate])

  const {
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(dateOfBirthSchema),
    defaultValues
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const { day, month, year } = watch()
  const isIncomplete = !day || !month || !year
  const newDateString = day && month && year ? `${year}-${month}-${day}` : ""
  const isSameDate = newDateString === currentFormattedDate
  const disableButton = isIncomplete || isSameDate

  const { mutate } = useMutation({
    mutationFn: async (data: { dateOfBirth: string }) => {
      return await axiosInstance.patch(USER_PATHS.EDIT_PROFILE, data)
    },
    onSuccess: () => {
      refetch()
    },
    onError: (error: unknown) => {
      console.error(error)
    }
  })

  const onSubmit = (data: DateOfBirthFormData) => {
    const dateString = `${data.year}-${data.month}-${data.day}`

    if (dateString === currentFormattedDate) {
      console.log("No changes detected. Not submitting.")
      return
    }

    mutate({ dateOfBirth: dateString })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <p className="block text-sm font-medium text-gray-700">Date of Birth</p>
      <div className="mt-1 flex space-x-2">
        <select
          {...register("day")}
          aria-label="Day of birth"
          className="w-16 border-b border-gray-300 p-2 text-center text-sm"
        >
          <option value="">DD</option>
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select
          {...register("month")}
          aria-label="Month of birth"
          className="w-32 border-b border-gray-300 p-2 text-center text-sm"
        >
          <option value="">Month</option>
          {MONTHS.map((month, index) => (
            <option key={month} value={String(index + 1).padStart(2, "0")}>
              {month}
            </option>
          ))}
        </select>

        <select
          {...register("year")}
          aria-label="Year of birth"
          className="w-20 border-b border-gray-300 p-2 text-center text-sm"
        >
          <option value="">YYYY</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {(errors.day || errors.month || errors.year) && (
        <p className="mt-1 text-xs text-red-500">{errors.day?.message || errors.month?.message || errors.year?.message}</p>
      )}
      <button
        type="submit"
        disabled={disableButton}
        className={`mt-4 ${disableButton ? "cursor-not-allowed" : "cursor-pointer"} bg-custom-green flex items-center gap-2 rounded-full px-4 py-2 text-center`}
        aria-label="Save date of birth"
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
    </form>
  )
}

export default UpdateDateOfBirth
