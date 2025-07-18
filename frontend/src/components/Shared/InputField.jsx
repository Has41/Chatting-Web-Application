import { useEffect } from "react"

const InputField = ({
  register,
  error,
  field,
  trigger,
  clearErrors,
  dayOptions,
  selectedDay,
  setSelectedDay,
  setDayOptions,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear
}) => {
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
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())

  const monthDays = {
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

  useEffect(() => {
    if (selectedMonth) {
      let daysInMonth = monthDays[selectedMonth]
      if (selectedMonth === "February" && selectedYear) {
        const yr = parseInt(selectedYear, 10)
        if ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0) {
          daysInMonth = 29
        } else {
          daysInMonth = 28
        }
      }
      setDayOptions(Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, "0")))
    }
  }, [selectedMonth, selectedYear])

  if (field.type === "date") {
    const dateError = error.dateOfBirth?.day || error.dateOfBirth?.month || error.dateOfBirth?.year
    return (
      <div className={`${dateError ? "mb-4" : ""}`}>
        <div key={field.id} className="flex items-center pb-2 focus-within:border-custom-border">
          <div className="relative w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`absolute left-0 top-2 h-6 w-6 ${dateError ? "text-red-400" : "text-gray-500"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={field.iconPath} />
            </svg>
            <div className="ml-6 flex gap-x-2">
              <div className="w-[40%] border-b border-gray-300">
                <select
                  id={"dateOfBirth.day"}
                  className="peer w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-0"
                  {...register("dateOfBirth.day")}
                  name={"dateOfBirth.day"}
                  onBlur={() => trigger("dateOfBirth.day")}
                  onFocus={() => clearErrors("dateOfBirth.day")}
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
                  className="w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-0"
                  {...register("dateOfBirth.month")}
                  name={"dateOfBirth.month"}
                  value={selectedMonth}
                  onBlur={() => trigger("dateOfBirth.month")}
                  onFocus={() => clearErrors("dateOfBirth.month")}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Month
                  </option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-[60%] border-b border-gray-300">
                <select
                  id={"dateOfBirth.year"}
                  className="w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-0"
                  {...register("dateOfBirth.year")}
                  name={"dateOfBirth.year"}
                  value={selectedYear}
                  onBlur={() => trigger("dateOfBirth.year")}
                  onFocus={() => clearErrors("dateOfBirth.year")}
                  onChange={(e) => setSelectedYear(e.target.value)}
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
        <p className={`ml-4 mt-1 select-none pb-1 text-sm ${dateError ? "text-red-500" : "invisible"}`}>
          {dateError?.message || "Placeholder"}
        </p>
      </div>
    )
  }

  return (
    <div className={`${error[field.id] ? "mb-4" : ""}`}>
      <div
        key={field.id}
        className={`${
          error[field.id] ? "border-b-[1px] border-red-300" : "border-b-[1px] border-gray-300"
        } flex items-center pb-2 focus-within:border-custom-border`}
      >
        <div className="relative w-full">
          <input
            id={field.id}
            className={`peer ml-6 ${
              error[field.id] ? "border-red-500" : "border-gray-300"
            } w-full border-custom-border px-3 py-2 text-gray-700 focus:outline-none focus:ring-0`}
            {...register(field.id)}
            name={field.id}
            type={field.type}
            onBlur={() => trigger(field.id)}
            onFocus={() => clearErrors(field.id)}
            placeholder=" "
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`absolute left-0 top-2 h-6 w-6 ${
              error[field.id] ? "text-red-400" : "text-gray-500"
            } peer-focus:text-custom-text`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={field.iconPath} />
          </svg>
          <label
            htmlFor={field.label}
            className={`pointer-events-none absolute left-9 top-2 -translate-y-8 scale-90 transform transition-all duration-300 ease-out peer-placeholder-shown:left-9 peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-8 ${
              error[field.id]
                ? "text-red-400 peer-placeholder-shown:text-red-400 peer-focus:text-red-400"
                : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-custom-text"
            } peer-focus:scale-90`}
          >
            {field.label}
          </label>
        </div>
      </div>
      <p className={`ml-4 mt-1 select-none pb-1 text-sm ${error[field.id] ? "text-red-500" : "invisible"}`}>
        {error[field.id]?.message || "Placeholder"}
      </p>
    </div>
  )
}

export default InputField
