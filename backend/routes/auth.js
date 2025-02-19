import express from "express"
import {
  register,
  login,
  logout,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  otherDetails,
  saveProfilePicture,
} from "../controllers/auth.js"
import {
  registerValidator,
  loginValidator,
  verifyOTPValidator,
  resendEmailValidator,
  resetPasswordValidator,
  otherFormValidator,
  profilePicValidator,
} from "../validators/authValidators.js"
import validateApiData from "../utils/apiValidator.js"

const router = express.Router()

router.post("/register", registerValidator, validateApiData, register)

router.post("/other-details", otherFormValidator, validateApiData, otherDetails)

router.post("/profile-pic", profilePicValidator, validateApiData, saveProfilePicture)

router.post("/login", loginValidator, validateApiData, login)

router.post("/logout", logout)

router.post("/verify-otp", verifyOTPValidator, validateApiData, verifyOTP)

router.post("/resend-otp", resendEmailValidator, validateApiData, resendOTP)

router.post("/forgot-password", resendEmailValidator, validateApiData, forgotPassword)

router.post("/reset-password", resetPasswordValidator, validateApiData, resetPassword)

export default router
