import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bioSchema } from "@shared/utils/zodSchema"
import { useUpdateProfileMutation } from "@profile/queries/profileQueries"

interface UpdateBioProps {
  currentBio?: string
}

interface BioFormData {
  bio?: string
}

const UpdateBio = ({ currentBio = "" }: UpdateBioProps) => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bioSchema),
    defaultValues: { bio: currentBio }
  })

  useEffect(() => {
    reset({ bio: currentBio })
  }, [currentBio, reset])

  const bio = useWatch({ control, name: "bio" })
  const disableButton = !bio || bio === currentBio

  const { mutate } = useUpdateProfileMutation()

  const onSubmit = (data: BioFormData) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative mb-4">
      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
        Bio
      </label>
      <input
        id="bio"
        type="text"
        {...register("bio")}
        placeholder="Edit your bio"
        className="mt-1 block w-full border-b border-gray-300 py-2 text-sm"
      />
      {errors.bio && <p className="mt-1 text-xs text-red-500">{String(errors.bio.message || "")}</p>}
      <button
        disabled={disableButton}
        type="submit"
        className={`bg-custom-green absolute top-6 right-2 flex h-8 w-8 items-center justify-center rounded-full ${disableButton ? "cursor-not-allowed" : "cursor-pointer"} text-center`}
        aria-label="Save bio"
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

export default UpdateBio
