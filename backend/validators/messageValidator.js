import { param, body } from "express-validator"

const validateMessageId = [
  param("messageId").notEmpty().withMessage("Message ID required").isMongoId().withMessage("Invalid user ID format."),
]

const editMessageValidator = [
  param("recipientId")
    .notEmpty()
    .withMessage("recipient ID required")
    .isMongoId()
    .withMessage("Invalid recipient ID format."),

  body("content").notEmpty().withMessage("Content required"),
]

const addReactionValidator = [
  param("messageId").notEmpty().withMessage("Message ID required").isMongoId().withMessage("Invalid user ID format."),

  body("emoji").notEmpty().withMessage("No emoji provided!"),
]

const validateBothId = [
  param("convoId")
    .notEmpty()
    .withMessage("recipient ID required")
    .isMongoId()
    .withMessage("Invalid recipient ID format."),

  param("recipientId")
    .notEmpty()
    .withMessage("recipient ID required")
    .isMongoId()
    .withMessage("Invalid recipient ID format."),
]

export { validateMessageId, editMessageValidator, addReactionValidator, validateBothId }
