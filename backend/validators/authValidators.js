import { body } from "express-validator"

const registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .trim()
    .escape(),

  body("email").notEmpty().withMessage("Email is required.").isEmail().withMessage("Must be a valid email address."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long.")
    .trim()
    .escape(),
]

const otherFormValidator = [
  body("userId").isMongoId(),
  body("displayName").optional().trim().escape(),
  body("dateOfBirth").optional().trim().escape(),
  body("bio").optional().trim().escape(),
]

const loginValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .trim()
    .escape(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long.")
    .trim()
    .escape(),
]

const profilePicValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .trim()
    .escape(),

  body("secure_url")
    .notEmpty()
    .withMessage("Secure URL is required.")
    .isString()
    .withMessage("Secure URL must be a string.")
    .isURL()
    .withMessage("Secure URL must be a valid URL.")
    .matches(/^https:\/\/res\.cloudinary\.com\//)
    .withMessage("Secure URL must be from Cloudinary."),

  body("public_id")
    .notEmpty()
    .withMessage("Public ID is required.")
    .isString()
    .withMessage("Public ID must be a string."),
]

const verifyOTPValidator = [
  body("email")
    .notEmpty()
    .withMessage("Verification email is required.")
    .isEmail()
    .withMessage("Must be a valid email address."),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters long.")
    .isAlphanumeric()
    .withMessage("OTP must contain only alphanumeric characters."),
]

const resendEmailValidator = [
  body("email")
    .notEmpty()
    .withMessage("Verification email is required.")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail(),
]

const resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Verification email is required.")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail(),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters long.")
    .isAlphanumeric()
    .withMessage("OTP must contain only alphanumeric characters."),

  body("newPassword")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long.")
    .trim()
    .escape(),
]

export {
  registerValidator,
  loginValidator,
  otherFormValidator,
  verifyOTPValidator,
  resendEmailValidator,
  resetPasswordValidator,
  profilePicValidator,
}
