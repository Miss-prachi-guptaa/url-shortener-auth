import z from "zod"

export const LoginUserSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email must be no more than 100 characters" }),

  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 charactes long" })
    .max(100, { message: " Password must be no more than 100 characters long" })
})

export const registerUserSchema = LoginUserSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be atleast 3 characters long" })
    .max(100, { message: "Name must not be more than 100 characters" }),

})

