import type { FieldErrors, FieldValues, Path, UseFormClearErrors, UseFormRegister, UseFormTrigger } from "react-hook-form"

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

const MONTH_DAYS: Record<string, number> = {
  January: 31,
  February: 28,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 31
}

const getDayOptionsForMonth = (month?: string, year?: string) => {
  if (!month) return []
  let daysInMonth = MONTH_DAYS[month]

  if (month === "February" && year) {
    const parsedYear = parseInt(year, 10)
    daysInMonth = (parsedYear % 4 === 0 && parsedYear % 100 !== 0) || parsedYear % 400 === 0 ? 29 : 28
  }

  return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, "0"))
}

interface InputFieldProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>
  error: FieldErrors<TFieldValues>
  field: {
    id: string
    label: string
    type: string
    iconPath: string
  }
  trigger: UseFormTrigger<TFieldValues>
  clearErrors: UseFormClearErrors<TFieldValues>
  dayOptions?: string[]
  selectedDay?: string
  setSelectedDay?: (value: string) => void
  setDayOptions?: (value: string[]) => void
  selectedMonth?: string
  setSelectedMonth?: (value: string) => void
  selectedYear?: string
  setSelectedYear?: (value: string) => void
}

const InputField = <TFieldValues extends FieldValues>({
  register,
  error,
  field,
  trigger,
  clearErrors,
  dayOptions = [],
  selectedDay,
  setSelectedDay = (_value: string) => {},
  setDayOptions = (_value: string[]) => {},
  selectedMonth,
  setSelectedMonth = (_value: string) => {},
  selectedYear,
  setSelectedYear = (_value: string) => {}
}: InputFieldProps<TFieldValues>) => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())
  const fieldPath = field.id as Path<TFieldValues>
  const fieldError = error[field.id] as { message?: string } | undefined
  const dateOfBirthError = error.dateOfBirth as
    | {
        day?: { message?: string }
        month?: { message?: string }
        year?: { message?: string }
      }
    | undefined

  if (field.type === "date") {
    const dateError = dateOfBirthError?.day || dateOfBirthError?.month || dateOfBirthError?.year
    return (
      <div className={`${dateError ? "mb-4" : ""}`}>
        <div key={field.id} className="focus-within:border-custom-border flex items-center pb-2">
          <div className="relative w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`absolute top-2 left-0 h-6 w-6 ${dateError ? "text-red-400" : "text-gray-500"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={field.iconPath} />
            </svg>
            <div className="ml-6 flex gap-x-2">
              <div className="w-[40%] border-b border-gray-300">
                <select
                  id={"dateOfBirth.day"}
                  className="peer w-full px-3 py-2 text-gray-700 focus:ring-0 focus:outline-none"
                  {...register("dateOfBirth.day" as Path<TFieldValues>)}
                  name={"dateOfBirth.day"}
                  onBlur={() => trigger("dateOfBirth.day" as Path<TFieldValues>)}
                  onFocus={() => clearErrors("dateOfBirth.day" as Path<TFieldValues>)}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  value={selectedDay}
                  defaultValue=""
                >
                  <option value="" disabled>
                    DD
                  </option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-[70%] border-b border-gray-300">
                <select
                  id={"dateOfBirth.month"}
                  className="w-full px-3 py-2 text-gray-700 focus:ring-0 focus:outline-none"
                  {...register("dateOfBirth.month" as Path<TFieldValues>)}
                  name={"dateOfBirth.month"}
                  value={selectedMonth}
                  onBlur={() => trigger("dateOfBirth.month" as Path<TFieldValues>)}
                  onFocus={() => clearErrors("dateOfBirth.month" as Path<TFieldValues>)}
                  onChange={(e) => {
                    const month = e.target.value
                    setSelectedMonth(month)
                    setDayOptions(getDayOptionsForMonth(month, selectedYear))
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Month
                  </option>
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-[60%] border-b border-gray-300">
                <select
                  id={"dateOfBirth.year"}
                  className="w-full px-3 py-2 text-gray-700 focus:ring-0 focus:outline-none"
                  {...register("dateOfBirth.year" as Path<TFieldValues>)}
                  name={"dateOfBirth.year"}
                  value={selectedYear}
                  onBlur={() => trigger("dateOfBirth.year" as Path<TFieldValues>)}
                  onFocus={() => clearErrors("dateOfBirth.year" as Path<TFieldValues>)}
                  onChange={(e) => {
                    const year = e.target.value
                    setSelectedYear(year)
                    setDayOptions(getDayOptionsForMonth(selectedMonth, year))
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    YYYY
                  </option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <p className={`mt-1 ml-4 pb-1 text-sm select-none ${dateError ? "text-red-500" : "invisible"}`}>
          {dateError?.message || "Placeholder"}
        </p>
      </div>
    )
  }

  return (
    <div className={`${fieldError ? "mb-4" : ""}`}>
      <div
        key={field.id}
        className={`${
          fieldError ? "border-b border-red-300" : "border-b border-gray-300"
        } focus-within:border-custom-border flex items-center pb-2`}
      >
        <div className="relative w-full">
          <input
            id={field.id}
            className={`peer ml-6 ${
              fieldError ? "border-red-500" : "border-gray-300"
            } border-custom-border w-full px-3 py-2 text-gray-700 focus:ring-0 focus:outline-none`}
            {...register(fieldPath)}
            name={field.id}
            type={field.type}
            onBlur={() => trigger(fieldPath)}
            onFocus={() => clearErrors(fieldPath)}
            placeholder=" "
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`absolute top-2 left-0 h-6 w-6 ${
              fieldError ? "text-red-400" : "text-gray-500"
            } peer-focus:text-custom-text`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={field.iconPath} />
          </svg>
          <label
            htmlFor={field.label}
            className={`pointer-events-none absolute top-2 left-9 -translate-y-8 scale-90 transform transition-all duration-300 ease-out peer-placeholder-shown:top-2 peer-placeholder-shown:left-9 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-8 ${
              fieldError
                ? "text-red-400 peer-placeholder-shown:text-red-400 peer-focus:text-red-400"
                : "peer-focus:text-custom-text text-gray-600 peer-placeholder-shown:text-gray-400"
            } peer-focus:scale-90`}
          >
            {field.label}
          </label>
        </div>
      </div>
      <p className={`mt-1 ml-4 pb-1 text-sm select-none ${fieldError ? "text-red-500" : "invisible"}`}>
        {fieldError?.message || "Placeholder"}
      </p>
    </div>
  )
}

export default InputField
