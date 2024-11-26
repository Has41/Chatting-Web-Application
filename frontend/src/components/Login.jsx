import React from "react"

const Login = ({ onButtonClick }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-lg w-full h-[480px] py-7 px-4 bg-white rounded-lg tracking-wide">
        <div className="ml-8 flex flex-col gap-y-4">
          <h2 className="text-[1.7rem] font-bold font-poppins text-black/80 relative after:content-[''] after:w-[3rem] after:block after:h-1 after:rounded-xl after:bg-dusty-grass after:absolute after:left-6 after:transform after:-translate-x-1/2 after:-bottom-1">
            Login
          </h2>
          <p className="font-poppins text-gray-600">Sign in to your account</p>
        </div>
        <div className="flex flex-col items-center mx-auto w-[90%]">
          <form action="#" className="w-full font-poppins py-8">
            <div className="flex items-center border-b-[1px] border-gray-300 focus-within:border-custom-border mb-6 pb-2">
              <div className="relative w-full">
                <input
                  id="username"
                  className="px-3 py-2 peer w-full ml-6 text-gray-700 focus:outline-none focus:ring-0 border-custom-border"
                  name="username"
                  type="text"
                  placeholder=" "
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-500 absolute left-0 top-2 peer-focus:text-custom-text"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <label
                  htmlFor="username"
                  className="absolute left-9 top-2 transition-all duration-300 ease-out transform scale-90 -translate-y-8 text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:left-9 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-8 peer-focus:scale-90 peer-focus:text-custom-text pointer-events-none"
                >
                  Username
                </label>
              </div>
            </div>

            <div className="flex items-center border-b-[1px] border-gray-300 focus-within:border-custom-border mb-6 pb-2">
              <div className="relative w-full">
                <input
                  id="password"
                  className="px-3 py-2 peer w-full ml-6 text-gray-700 focus:outline-none focus:ring-0 focus:border-black/80"
                  name="password"
                  type="password"
                  placeholder=" "
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-500 absolute left-0 top-2 peer-focus:text-custom-text"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <label
                  htmlFor="password"
                  className="absolute left-9 top-2 transition-all duration-300 ease-out transform scale-90 -translate-y-7 text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:left-9 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-7 peer-focus:scale-90 peer-focus:text-custom-text pointer-events-none"
                >
                  Password
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center my-4">
              <div className="flex items-center gap-x-2">
                <input
                  id="remember"
                  className="rounded-sm lg:text-lg border border-slate-300 active:border active:border-custom-border checked:bg-custom-green focus:border-transparent focus:ring-0"
                  type="checkbox"
                />
                <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div>
                <a href="#" className="text-sm text-gray-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="py-4">
              <button className="w-full shadow-md px-4 py-2 bg-button-color font-poppins text-white rounded font-semibold">
                Login Now
              </button>
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-black/80">
                Not signed in yet?{" "}
                <span onClick={() => onButtonClick("Register")} className="font-bold cursor-pointer">
                  Sign up now!
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
