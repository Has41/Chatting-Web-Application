export interface SaveProfilePicturePayload {
  secure_url: string
  public_id: string
  username: string | null
}

export interface SaveProfilePictureResponse {
  message?: string
}
