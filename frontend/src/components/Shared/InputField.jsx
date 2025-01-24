const InputField = ({ register, error, field, trigger, clearErrors }) => {
  return (
    <div className={`${error[field.id] ? "mb-4" : ""} `}>
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
            className={`absolute left-0 top-2 size-6 ${
              error[field.id] ? "text-red-400" : "text-gray-500"
            } text-gray-500 peer-focus:text-custom-text`}
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
      {/* Error message */}
      <p className={`ml-4 mt-1 select-none pb-1 text-sm ${error[field.id] ? "text-red-500" : "invisible"}`}>
        {error[field.id]?.message || "Placeholder"} {/* Placeholder ensures consistent height */}
      </p>
    </div>
  )
}

export default InputField
