import { body, param } from "express-validator"

const editInfoValidator = [
  body("displayName").optional().trim().escape(),

  body("dateOfBirth")
    .optional()
    // .isDate().withMessage('Must be a valid date.')
    .trim()
    .escape(),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Prefer not to say"])
    .withMessage("Gender must be male, female, or Prefer not to say.")
    .trim()
    .escape(),

  body("location").optional().trim().escape(),

  body("bio").optional().trim().escape(),
]

const addInterestValidator = [body("newInterest").notEmpty().isString().withMessage("Interests must be a string.")]

const removeInterestValidator = [
  body("interestToRemove").notEmpty().isString().withMessage("Interests must be a string."),
]

const validateUserId = [
  param("userId").notEmpty().withMessage("User ID required").isMongoId().withMessage("Invalid user ID format."),
]

const respondRequestValidator = [
  param("userId").notEmpty().withMessage("User ID required").isMongoId().withMessage("Invalid user ID format."),

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
