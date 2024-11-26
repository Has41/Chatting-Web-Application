import path from "path"
import nodemailer from "nodemailer"
import nodemailerExpressHandlebars from "nodemailer-express-handlebars"
import errorHandler from "./errorHandler.js"

//* Set up Nodemailer transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
})

//! Configure Handlebars
transporter.use(
  "compile",
  nodemailerExpressHandlebars({
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./views/emails"),
      layoutsDir: path.resolve("./views/emails"),
      defaultLayout: "",
    },
    viewPath: path.resolve("./views/emails"),
    extName: ".hbs",
  })
)

const sendOTP = async (email, username, otp, templateType) => {
  try {
    const subject =
      templateType === "passwordReset"
        ? "Password Reset Request"
        : "Your OTP Code for Account Verification"

    await transporter.sendMail({
      from: `ChitChat <${process.env.BREVO_EMAIL}>`,
      to: email,
      subject: subject,
      template: templateType,
      context: {
        username: username,
        otp: otp,
      },
    })
  } catch (mailError) {
    console.error("Error sending OTP:", mailError)
    return errorHandler(
      500,
      "Failed to send OTP. Please try again later." + mailError.message
    )
  }
}

export default sendOTP
