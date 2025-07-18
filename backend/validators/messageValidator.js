import { param, body } from "express-validator"

const validateMessageId = [
  param("messageId").notEmpty().withMessage("Message ID required").isMongoId().withMessage("Invalid user ID format."),
]

const editMessageValidator = [
  param("messageId")
    .notEmpty()
    .withMessage("message ID required")
    .isMongoId()
    .withMessage("Invalid message ID format."),

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

const validateSendMessage = [
  body("messageData").isObject().withMessage("Message data must be an object!"),
  body("fileData").optional().isObject().withMessage("File data must be an object if provided"),
]

export { validateMessageId, editMessageValidator, addReactionValidator, validateBothId, validateSendMessage }
