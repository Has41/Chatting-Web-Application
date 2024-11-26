import { body } from "express-validator"

const registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .trim()
    .escape(),

  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long.")
    .trim()
    .escape(),

  body("displayName").optional().trim().escape(),

  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Must be a valid phone number.")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be exactly 10 digits long.")
    .trim()
    .escape(),

  body("dateOfBirth")
    .optional()
    // .isDate().withMessage('Must be a valid date.')
    .trim()
    .escape(),

  body("gender")
    .optional()
    .isIn(["male", "female", "Prefer not to say"])
    .withMessage("Gender must be male, female, or Prefer not to say.")
    .trim()
    .escape(),

  body("location").optional().trim().escape(),

  body("bio").optional().trim().escape(),

  body("interests")
    .optional()
    .isString()
    .withMessage("Interests must be a string.")
    .customSanitizer((value) => {
      if (!value) return []
      return value.split(",").map((item) => item.trim().escape())
    }),
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

const verifyOTPValidator = [
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
  verifyOTPValidator,
  resendEmailValidator,
  resetPasswordValidator,
}
