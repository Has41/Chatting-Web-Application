import express from "express"
import { register, login, logout, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../controllers/auth.js"
import { uploadProfilePicture } from "../middlewares/uploads.js"
import { validationResult } from "express-validator"
import {
  registerValidator,
  loginValidator,
  verifyOTPValidator,
  resendEmailValidator,
  resetPasswordValidator,
} from "../validators/authValidators.js"

const router = express.Router()

router.post(
  "/register",
  uploadProfilePicture.single("profilePicture"),
  registerValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  register
)

router.post(
  "/login",
  loginValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  login
)

router.post("/logout", logout)

router.post(
  "/verify-otp",
  verifyOTPValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  verifyOTP
)

router.post(
  "/resend-otp",
  resendEmailValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  resendOTP
)

router.post(
  "/forgot-password",
  resendEmailValidator,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  forgotPassword
)

router.post(
  "/reset-password",
  resetPasswordValidator,
  (req, res, next) => {
    console.log("Received body:", req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  resetPassword
)

export default router
