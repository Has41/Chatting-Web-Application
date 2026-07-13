export type AuthFormView = "Login" | "Register" | "OtpPage" | "InfoForm" | "ProfileForm"

export interface AuthSwitchProps {
  onButtonClick?: (view: AuthFormView) => void
}

export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginFormData {
  username: string
  password: string
}

export interface InfoFormData {
  displayName: string
  bio: string
}
