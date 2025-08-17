import z from "zod"

export const shortUserSchema = z.object({
  url: z.string({ required_error: "URL is required" })
    .trim()
    .url({ message: "Please enter a valid url" })
    .max(1024, { message: "Url cannot be longer than 1024 character" }),

  shortcode: z
    .string({ required_error: "Short code is required." })
    .trim()
    .min(3, { message: "Short code must be at least 3 characters long." })
    .max(50, { message: "Short code cannot be longer than 50 characters." }),

})