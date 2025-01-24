const ProfileUpload = ({ avatar, register }) => {
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="overflow-none size-64 rounded-full border-2 border-slate-200">
          {avatar ? (
            <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="m-auto flex h-full items-center justify-center text-sm text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        <div className="py-5">
          <label htmlFor="avatar" className="mb-2 block cursor-pointer font-medium text-gray-700">
            <div className="flex items-center justify-between rounded-md bg-slate-50 px-4 py-2">
              <span className="font-poppins text-sm">Choose an avatar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            </div>
          </label>
          <input type="file" {...register("file")} id="avatar" className="hidden" />
        </div>
        <div className="flex max-w-[95%] flex-col items-center justify-between gap-y-4 pb-6">
          <button
            className="ml-2 flex w-full items-center justify-center rounded-[4px] bg-dusty-grass py-2 font-semibold tracking-wider text-white"
            type="submit"
          >
            <span>Submit</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ProfileUpload
