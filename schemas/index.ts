import * as z from "zod";

const SecuritySchema = z.object({
  twoFA: z.boolean().optional(),
  newPassword: z.string()
    .trim().min(6, { message: "Minimum 6 characters required" }).optional() ,
});

const ProfileEditSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address" })
    .optional(), 
  name: z
    .string()
    .trim()
    .min(3, { message: "Minimum 3 characters required" })
    .max(25, { message: "Name cannot be longer than 25 characters" })
    .optional(),
});


const ResetSchema = (isCodeSent: boolean) => z.object({
  email: z.string()
    .trim() 
    .email({ message: "Please provide a valid email address" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" }),
  otp: z.string()
    .trim() 
    .min(6, { message: "OTP must be at least 6 characters long" })
    .max(6, { message: "OTP must not exceed 6 characters" })
    .optional()
    .refine(val => isCodeSent ? !!val : true, {
      message: "Verification code is required",
    }),
  newPassword: z.string()
    .trim()
    .min(6, { message: "Minimum 6 characters required" })
    .optional()
    .refine(val => isCodeSent ? !!val : true, {
      message: "New password is required",
    }),
});

const LoginSchema =  z.object({
  email: z.string()
    .trim() 
    .email({ message: "Email is required" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" }),
  password: z.string()
    .trim() 
    .min(1, {
      message: "Password is required",
    }),
    twoFA: z.string().trim().min(6, { message: "Code must be at least 6 characters" })
    .max(6, { message: "Code must be at most 6 characters" }).optional(),
});

const RegisterSchema = z.object({
  email: z.string()
    .trim() // Trims the email input
    .email({ message: "Email is required" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" }),
  password: z.string()
    .trim() // Trims the password input
    .min(6, { message: "Minimum 6 characters required" }),
  name: z.string()
    .trim() // Trims the name input
    .min(3, { message: "Minimum 4 characters required" })
    .max(25, { message: "Name cannot be longer than 25 characters" }),
});

const OtpSchema = z.object({
  otp: z.string()
    .trim() 
    .min(6, { message: "OTP must be at least 6 characters" })
    .max(6, { message: "OTP must be at most 6 characters" }),
});

export { LoginSchema, RegisterSchema, ResetSchema, OtpSchema, ProfileEditSchema, SecuritySchema };
