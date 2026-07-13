export type ProfileGender = "Male" | "Female" | "Prefer not to say"

export interface UpdateProfilePayload {
  displayName?: string
  bio?: string
  dateOfBirth?: string
  gender?: ProfileGender
  location?: string
}

export interface AddInterestPayload {
  newInterest: string
}

export interface RemoveInterestPayload {
  interestToRemove: string
}
