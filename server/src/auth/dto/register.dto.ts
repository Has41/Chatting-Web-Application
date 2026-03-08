import { IsString, IsEmail, MinLength, Matches } from 'class-validator'
import { Transform } from 'class-transformer'

export class RegisterDto {
  @IsString({ message: 'Username is required and must be a string' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must be alphanumeric',
  })
  @Transform(({ value }) => value?.trim())
  username: string

  @IsEmail({}, { message: 'Must be a valid email address' })
  @Transform(({ value }) => value?.trim())
  email: string

  @IsString({ message: 'Password is required and must be a string' })
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  @Transform(({ value }) => value?.trim())
  password: string
}