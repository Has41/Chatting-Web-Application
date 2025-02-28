import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import errorHandler from "../utils/errorHandler.js"
import OTP from "../models/Otp.js"
import sendOTP from "../utils/sendOTP.js"
// import formatNumber from "../utils/phoneUtils.js"
import crypto from "crypto"

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return errorHandler(400, "User already exists.")
    }

    const existingEmail = await User.findOne({ email })

    if (existingEmail) {
      return next(errorHandler(400, "Email already exists."))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    const savedUser = await newUser.save()

    const otp = crypto.randomBytes(6).toString("hex").slice(0, 6)

    const newOTP = new OTP({ email, otp })

    await newOTP.save()

    await sendOTP(email, username, otp, "verification")
    console.log(savedUser._id)

    if (savedUser) {
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      })
    }
  } catch (err) {
    return next(errorHandler(404, err))
  }
}

const otherDetails = async (req, res, next) => {
  try {
    const { displayName, dateOfBirth, bio, userId } = req.body
    if (!displayName && !dateOfBirth && !bio) {
      return next(errorHandler(404, "Atleast one detail should be present"))
    }
    if (!userId) {
      return next(errorHandler(404, "userId should be present"))
    }

    const saveDetail = await User.findByIdAndUpdate(
      userId,
      {
        $set: { displayName, dateOfBirth, bio },
      },
      { new: true }
    )

    if (!saveDetail) {
      return next(errorHandler(404, "User not found"))
    }
    res.status(200).json({ message: "Other details added successfully!", user: saveDetail })
  } catch (err) {
    return next(errorHandler(404, err))
  }
}

const saveProfilePicture = async (req, res, next) => {
  try {
    const { secure_url, public_id, username } = req.body

    if (!secure_url || !public_id || !username) {
      return next(errorHandler(404, "All fields should be present"))
    }

    const saveProfilePic = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          "profilePicture.publicId": public_id,
          "profilePicture.url": secure_url,
        },
      },
      { new: true }
    )

    if (!saveProfilePic) {
      return next(errorHandler(404, "Username not found!"))
    }
    res.status(200).json({ message: "Profile picture added successfully!" })
  } catch (err) {
    return next(errorHandler(404, err))
  }
}

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    const findOTP = await OTP.findOne({ email }).select("otp")

    if (!findOTP.otp || findOTP.otp !== otp) {
      return res.status(404).json({ message: "Invalid OTP or OTP expired!" })
    }

    const user = await User.findOne({ email }).select("verification")

    if (user) {
      if (user.verification) {
        await OTP.deleteOne({ email })
        return res.status(200).json({ message: "Email already verified." })
      }
      user.verification = true
      await user.save()
    }

    if (user.verification) {
      await OTP.deleteOne({ email })
    }

    res.status(200).json({ message: "OTP verified successfully." })
  } catch (err) {
    return next(errorHandler(500, err.message || "Internal server error"))
  }
}

const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body

    const findUser = await User.findOne({ email }).select("username")

    await OTP.deleteMany({ email })

    const resentOTP = crypto.randomBytes(6).toString("hex").slice(0, 6)

    const newOTP = new OTP({
      email: email,
      otp: resentOTP,
    })

    const savedOTP = await newOTP.save()

    if (!savedOTP) {
      return next(errorHandler(400, "Failed to send OTP!"))
    }

    await sendOTP(email, findUser.username, resentOTP, "verification")

    res.status(200).json({ message: "OTP resent successfully!" })
  } catch (err) {
    return next(errorHandler(500, err.message))
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const findUser = await User.findOne({ email }).select("username")

    const otp = crypto.randomBytes(6).toString("hex").slice(0, 6)

    const newOTP = new OTP({
      email: email,
      otp: otp,
    })

    const savedOTP = await newOTP.save()

    if (!savedOTP) {
      return next(errorHandler(400, "Failed to send OTP!"))
    }

    await sendOTP(email, findUser.username, otp, "passwordReset")

    return res.status(200).send("Verification email sent Successfully!")
  } catch (err) {
    return next(errorHandler(500, err))
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body

    //Finding accurate OTP
    const findOTP = await OTP.findOne({ email, otp })

    if (!findOTP) {
      return next(errorHandler(400, "Invalid or expired OTP."))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const findUser = await User.findOne({ email })

    findUser.password = hashedPassword

    const savedUserPass = await findUser.save()

    if (!savedUserPass) {
      return next(errorHandler(400, "Unable to save user password."))
    }

    await OTP.deleteOne({ email, otp })

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })

    return res.status(200).json({ message: "Password has been reset successfully." })
  } catch (err) {
    return next(errorHandler(500, err))
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const findUser = await User.findOne({ username }).select("username email password profilePicture")

    if (!findUser) {
      return next(errorHandler(404, "User not found."))
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password)

    if (!isPasswordValid) {
      return next(errorHandler(401, "Incorrect password."))
    }

    const payLoad = {
      id: findUser._id,
      name: findUser.username,
      email: findUser.email,
      profilePicture: findUser.profilePicture,
    }

    try {
      const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
        expiresIn: "1d",
      })
      return res
        .status(200)
        .cookie("accessToken", token, {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json("Login Success!")
    } catch (tokenError) {
      console.error("Token Signing Error:", tokenError)
      return next(errorHandler(500, "Error signing token"))
    }
  } catch (err) {
    return next(errorHandler(404, err))
  }
}

const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  })
  return res.status(200).json({ message: `Logout Success` })
}

export {
  register,
  login,
  logout,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  otherDetails,
  saveProfilePicture,
}
