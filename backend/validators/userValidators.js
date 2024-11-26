import { body, param } from "express-validator"

const editInfoValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),

  body("username")
    .optional()
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .trim()
    .escape(),

  body("displayName").optional().trim().escape(),

  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Must be a valid phone number.")
    .isLength({ min: 10, max: 10 })
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
]

const addInterestValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),

  body("newInterest")
    .notEmpty()
    .isString()
    .withMessage("Interests must be a string.")
    .customSanitizer((value) => {
      if (!value) return []
      return value.split(",").map((item) => item.trim().escape())
    }),
]

const removeInterestValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),

  param("interest")
    .notEmpty()
    .isString()
    .withMessage("Interests must be a string.")
    .customSanitizer((value) => {
      if (!value) return []
      return value.split(",").map((item) => item.trim().escape())
    }),
]

const validateUserId = [
  param("userId")
    .notEmpty()
    .withMessage("User ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),
]

const respondRequestValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),

  body("response")
    .notEmpty()
    .withMessage("Response is necessary")
    .isIn(["accepted", "rejected"])
    .withMessage("Invalid response!")
    .trim()
    .escape(),
]

const searchInfoValidator = [
  param("searchInfo")
    .trim()
    .notEmpty()
    .withMessage("Search info is required")
    .isLength({ min: 3 })
    .withMessage("Search info must be at least 3 characters long"),
]

export {
  editInfoValidator,
  addInterestValidator,
  removeInterestValidator,
  validateUserId,
  respondRequestValidator,
  searchInfoValidator,
}
