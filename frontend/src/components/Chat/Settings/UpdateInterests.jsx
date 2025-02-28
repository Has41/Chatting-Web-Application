import React, { useState } from "react"
import { useMutation } from "react-query"
import { USER_PATHS } from "../../../constants/apiPaths"
import axiosInstance from "../../../utils/axiosInstance"

const UpdateInterests = ({ currentInterests }) => {
  const [interests, setInterests] = useState(currentInterests || [])
  const [input, setInput] = useState("")

  const { mutate: insertInterest } = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.post(USER_PATHS.ADD_INTEREST, data)
    },
    onSuccess: () => {
      console.log("Interest Added!")
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const { mutate: removeInterest } = useMutation({
    mutationFn: async (data) => {
      return await axiosInstance.delete(USER_PATHS.REMOVE_INTEREST, { data })
    },
    onSuccess: () => {
      console.log("Interest Removed")
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const addUserInterest = () => {
    if (input.trim()) {
      setInterests((prev) => [...prev, input.trim()])
      const newInterest = input.trim()
      setInput("")
      insertInterest({ newInterest })
    }
  }

  const removeUserInterest = (userInterest) => {
    const updatedInterest = interests.filter((interest) => interest !== userInterest)
    setInterests(updatedInterest)
    removeInterest({ interestToRemove: userInterest })
  }

  return (
    <div className="mb-4">
      <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
        Interests
      </label>
      <div className="relative mt-1">
        <input
          id="interests"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="List your interests"
          className="block w-full border-b border-gray-300 p-2 pr-10 text-sm shadow-sm"
        />
        <button
          type="button"
          onClick={addUserInterest}
          className="absolute inset-y-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-custom-green text-center"
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
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {interests.map((interest, idx) => (
          <span key={idx} className="inline-flex items-center rounded-2xl bg-custom-white px-3 py-1 text-sm shadow-md">
            {interest}
            <button type="button" onClick={() => removeUserInterest(interest)} className="ml-2" aria-label="Remove Interest">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default UpdateInterests
