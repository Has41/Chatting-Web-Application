import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "react-query"
import { USER_PATHS } from "../../../constants/apiPaths"
import axiosInstance from "../../../utils/axiosInstance"

const dateOfBirthSchema = z.object({
  day: z.string().nonempty("Day is required"),
  month: z.string().nonempty("Month is required"),
  year: z.string().nonempty("Year is required")
})

const UpdateDateOfBirth = ({ currentDateOfBirth }) => {
  let defaultValues = { day: "", month: "", year: "" }
  if (currentDateOfBirth) {
    const date = new Date(currentDateOfBirth)
    defaultValues = {
      day: String(date.getDate()).padStart(2, "0"),
      month: String(date.getMonth() + 1).padStart(2, "0"),
      year: String(date.getFullYear())
    }
  }

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(dateOfBirthSchema),
    defaultValues
  })

  const { day, month, year } = watch()
  const isIncomplete = !day || !month || !year
  const newDateString = day && month && year ? `${year}-${month}-${day}` : ""
  const currentFormattedDate = currentDateOfBirth ? new Date(currentDateOfBirth).toISOString().split("T")[0] : ""
  const isSameDate = newDateString === currentFormattedDate
  const disableButton = isIncomplete || isSameDate

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
    const dateString = `${data.year}-${data.month}-${data.day}`
    const currentFormattedDate = currentDateOfBirth ? new Date(currentDateOfBirth).toISOString().split("T")[0] : ""

    if (dateString === currentFormattedDate) {
      console.log("No changes detected. Not submitting.")
      return
    }

    mutate({ dateOfBirth: dateString })
  }

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))
  const months = [
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
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 121 }, (_, i) => currentYear - i)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
      <div className="mt-1 flex space-x-2">
        <select {...register("day")} className="w-16 border-b border-gray-300 p-2 text-center text-sm">
          <option value="">DD</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select {...register("month")} className="w-32 border-b border-gray-300 p-2 text-center text-sm">
          <option value="">Month</option>
          {months.map((month, index) => (
            <option key={month} value={String(index + 1).padStart(2, "0")}>
              {month}
            </option>
          ))}
        </select>

        <select {...register("year")} className="w-20 border-b border-gray-300 p-2 text-center text-sm">
          <option value="">YYYY</option>
          {years.map((year) => (
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
        className={`mt-4 ${disableButton ? "cursor-not-allowed" : "cursor-pointer"} flex items-center gap-2 rounded-full bg-custom-green px-4 py-2 text-center`}
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
    </form>
  )
}

export default UpdateDateOfBirth
