import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      publicId: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    displayName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say"],
      default: "Prefer not to say",
    },
    location: {
      type: String,
      default: "Pakistan",
    },
    bio: {
      type: String,
      default: "Hey, using this app",
    },
    interests: {
      type: [String],
      default: [],
    },
    verification: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    conversations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
  },
  { timestamps: true }
)

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
