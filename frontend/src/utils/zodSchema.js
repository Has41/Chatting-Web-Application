import { z } from "zod"

const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .max(100, { message: "Username can't be longer than 100 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }).min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password can't be longer than 100 characters" }),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, { message: "Password can't be longer than 100 characters" }),
    file: z
      .custom((file) => file instanceof File, { message: "Please upload a valid file" })
      .refine((file) => file.size < 2 * 1024 * 1024, { message: "File size must be less than 2MB" })
      .refine((file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type), {
        message: "Only PNG, JPG, and JPEG files are allowed"
      })
      .optional()
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is not the same as confirm password",
        path: ["confirmPassword"]
      })
    }
  })

const dateOfBirthSchema = z
  .object({
    day: z.string().optional(),
    month: z.string().optional(),
    year: z.string().optional()
  })
  .refine(
    (data) => {
      if (!data.day && !data.month && !data.year) return true
      return Boolean(data.day && data.month && data.year)
    },
    {
      message: "Please provide day, month, and year for the date of birth"
    }
  )

const otherDetailSchema = z.object({
  displayName: z.string().optional(),
  dateOfBirth: dateOfBirthSchema.optional(),
  bio: z.string().optional()
})

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" })
})

export { registerSchema, loginSchema, otherDetailSchema }
