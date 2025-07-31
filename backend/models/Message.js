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
        required: function () {
          return ["file"].includes(this.messageType)
        },
        default: "",
      },
      mediaUrl: {
        type: String,
        required: function () {
          return ["file"].includes(this.messageType)
        },
        default: "",
      },
      thumbnailUrl: {
        type: String,
        default: "",
      },
      caption: {
        type: String,
        default: "",
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
    editedAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema)

export default Message
