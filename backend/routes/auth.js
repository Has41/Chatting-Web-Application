import express from "express"
import { register, login, logout, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../controllers/auth.js"
import { uploadProfilePicture } from "../middlewares/uploads.js"
import {
  registerValidator,
  loginValidator,
  verifyOTPValidator,
  resendEmailValidator,
  resetPasswordValidator,
} from "../validators/authValidators.js"
import validateApiData from "../utils/apiValidator.js"

const router = express.Router()

router.post("/register", uploadProfilePicture.single("profilePicture"), registerValidator, validateApiData, register)

router.post("/login", loginValidator, validateApiData, login)

router.post("/logout", logout)

router.post("/verify-otp", verifyOTPValidator, validateApiData, verifyOTP)

router.post("/resend-otp", resendEmailValidator, validateApiData, resendOTP)

router.post("/forgot-password", resendEmailValidator, validateApiData, forgotPassword)

router.post("/reset-password", resetPasswordValidator, validateApiData, resetPassword)

export default router
