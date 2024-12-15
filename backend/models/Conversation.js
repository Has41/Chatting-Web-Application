import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    conversationType: {
      type: String,
      enum: ["private", "group", "channel"],
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupName: {
      type: String,
      required: function () {
        return this.conversationType === "group" || this.conversationType === "channel"
      },
    },
    groupPicture: {
      publicId: String,
      url: String,
    },
    groupOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.conversationType === "group" || this.conversationType === "channel"
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
)

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation
