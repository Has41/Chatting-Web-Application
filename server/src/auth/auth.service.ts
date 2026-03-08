import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User, UserDocument } from '../users/schemas/users.schema'
import { Otp, OtpDocument } from '../users/schemas/otp.schema'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import * as nodemailer from 'nodemailer'
import * as path from 'path'
import * as nodemailerExpressHandlebars from 'nodemailer-express-handlebars'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private jwtService: JwtService,
  ) {}

  private async sendOTP(email: string, username: string, otp: string, templateType: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASS,
        },
      })

      // @ts-ignore - nodemailer-express-handlebars types are incomplete
      transporter.use(
        'compile',
        nodemailerExpressHandlebars({
          viewEngine: {
            extName: '.hbs',
            partialsDir: path.resolve('./views/emails'),
            layoutsDir: path.resolve('./views/emails'),
            defaultLayout: '',
          },
          viewPath: path.resolve('./views/emails'),
          extName: '.hbs',
        }),
      )

      const subject =
        templateType === 'passwordReset' ? 'Password Reset Request' : 'Your OTP Code for Account Verification'

      // @ts-ignore - nodemailer types are incomplete for handlebars
      await transporter.sendMail({
        from: `ChitChat <${process.env.BREVO_EMAIL || 'noreply@chitchat.com'}>`,
        to: email,
        subject: subject,
        template: templateType,
        context: {
          username: username,
          otp: otp,
        },
      } as any)
    } catch (mailError) {
      console.error('Error sending OTP:', mailError)
      throw new HttpException('Failed to send OTP. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto

    const existingUser = await this.userModel.findOne({ username })
    if (existingUser) {
      throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST)
    }

    const existingEmail = await this.userModel.findOne({ email })
    if (existingEmail) {
      throw new HttpException('Email already exists.', HttpStatus.BAD_REQUEST)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    })

    const savedUser = await newUser.save()

    const otp = uuidv4().slice(0, 6)

    const newOTP = new this.otpModel({ email, otp })
    await newOTP.save()

    await this.sendOTP(email, username, otp, 'verification')

    return {
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    }
  }

  async login(loginDto: LoginDto, response: any) {
    const { username, password } = loginDto

    const findUser = await this.userModel.findOne({ username }).select('username email password profilePicture')

    if (!findUser) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password)
    if (!isPasswordValid) {
      throw new HttpException('Incorrect password.', HttpStatus.UNAUTHORIZED)
    }

    const payload = {
      id: findUser._id,
      name: findUser.username,
      email: findUser.email,
      profilePicture: findUser.profilePicture,
    }

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '1d',
    })

    response.cookie('accessToken', token, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    return 'Login Success!'
  }

  logout(response: any) {
    response.clearCookie('accessToken', {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })
    return { message: 'Logout Success' }
  }

  async verifyOTP(email: string, otp: string) {
    const findOTP = await this.otpModel.findOne({ email }).select('otp')

    if (!findOTP || findOTP.otp !== otp) {
      throw new HttpException('Invalid OTP or OTP expired!', HttpStatus.NOT_FOUND)
    }

    const user = await this.userModel.findOne({ email }).select('verification')

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    if (user.verification) {
      await this.otpModel.deleteOne({ email })
      return { message: 'Email already verified.' }
    }

    user.verification = true
    await user.save()
    await this.otpModel.deleteOne({ email })

    return { message: 'OTP verified successfully.' }
  }

  async resendOTP(email: string) {
    const findUser = await this.userModel.findOne({ email }).select('username')

    if (!findUser) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    await this.otpModel.deleteMany({ email })

    const resentOTP = uuidv4().slice(0, 6)

    const newOTP = new this.otpModel({
      email: email,
      otp: resentOTP,
    })

    await newOTP.save()

    await this.sendOTP(email, findUser.username, resentOTP, 'verification')

    return { message: 'OTP resent successfully!' }
  }

  async forgotPassword(email: string) {
    const findUser = await this.userModel.findOne({ email }).select('username')

    if (!findUser) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    const otp = uuidv4().slice(0, 6)

    const newOTP = new this.otpModel({
      email: email,
      otp: otp,
    })

    await newOTP.save()

    await this.sendOTP(email, findUser.username, otp, 'passwordReset')

    return 'Verification email sent Successfully!'
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const findOTP = await this.otpModel.findOne({ email, otp })

    if (!findOTP) {
      throw new HttpException('Invalid or expired OTP.', HttpStatus.BAD_REQUEST)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const findUser = await this.userModel.findOne({ email })
    if (!findUser) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    findUser.password = hashedPassword
    await findUser.save()

    await this.otpModel.deleteOne({ email, otp })

    return { message: 'Password has been reset successfully.' }
  }

  async saveOtherDetails(userId: string, data: { displayName?: string; dateOfBirth?: string; bio?: string }) {
    if (!data.displayName && !data.dateOfBirth && !data.bio) {
      throw new HttpException('Atleast one detail should be present', HttpStatus.BAD_REQUEST)
    }

    const saveDetail = await this.userModel.findByIdAndUpdate(userId, { $set: data }, { new: true })

    if (!saveDetail) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return { message: 'Other details added successfully!', user: saveDetail }
  }

  async saveProfilePicture(username: string, secure_url: string, public_id: string) {
    const saveProfilePic = await this.userModel.findOneAndUpdate(
      { username },
      {
        $set: {
          'profilePicture.publicId': public_id,
          'profilePicture.url': secure_url,
        },
      },
      { new: true },
    )

    if (!saveProfilePic) {
      throw new HttpException('Username not found!', HttpStatus.NOT_FOUND)
    }

    return { message: 'Profile picture added successfully!' }
  }
}
