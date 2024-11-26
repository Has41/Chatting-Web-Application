import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: function () {
        return this.messageType === "text"
      },
    },
    media: {
      publicId: {
        type: String,
        default: "",
      },
      mediaUrl: {
        type: String,
        required: function () {
          return ["file"].includes(this.messageType)
        },
        default: "",
      },
      meta: {
        fileType: {
          type: String,
          required: function () {
            return ["file"].includes(this.messageType)
          },
        },
        fileSize: {
          type: Number,
          min: 0,
        },
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      required: true,
    },
    seenBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seenAt: { type: Date, default: Date.now },
      },
    ],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: { type: String, default: "" },
      },
    ],
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    editedAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema)

export default Message
