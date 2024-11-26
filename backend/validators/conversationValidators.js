import { body, param } from "express-validator"

const validateConvoId = [
  param("convoId")
    .notEmpty()
    .withMessage("conversation ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),
]

const createConversationValidator = [
  body("participants")
    .notEmpty()
    .withMessage("Must contain participants!")
    .isLength({ min: 2 })
    .withMessage("A group must have at least two participants"),

  body("groupName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Group name must be at least 3 characters long"),

  body("groupPicture")
    .optional()
    .isURL()
    .withMessage("Invalid group picture URL format"),
]

const editConversationValidator = [
  param("convoId")
    .notEmpty()
    .withMessage("conversation ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),

  body("groupName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Group name must be at least 3 characters long"),

  body("groupPicture")
    .optional()
    .isURL()
    .withMessage("Invalid group picture URL format"),

  (req, res, next) => {
    const { groupName, groupPicture } = req.body
    if (!groupName && !groupPicture) {
      return res
        .status(400)
        .json({ message: "At least one field must be updated" })
    }
    next()
  },
]

const addParticipantValidator = [
  param("convoId")
    .notEmpty()
    .withMessage("conversation ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),

  body("participants").notEmpty().withMessage("Select participants to add!"),
]

const removeParticipantValidator = [
  param("convoId")
    .notEmpty()
    .withMessage("conversation ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),

  body("participants").notEmpty().withMessage("Select participants to remove!"),
]

const changeGroupOwnershipValidator = [
  param("convoId")
    .notEmpty()
    .withMessage("conversation ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),

  param("newOwnerId")
    .notEmpty()
    .withMessage("New Owner ID required")
    .isMongoId()
    .withMessage("Invalid user ID format."),
]

export {
  validateConvoId,
  createConversationValidator,
  editConversationValidator,
  addParticipantValidator,
  removeParticipantValidator,
  changeGroupOwnershipValidator,
}
