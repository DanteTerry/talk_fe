import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, "First Name must only contain letters and spaces")
    .min(2, "First Name must be at least 2 Characters"),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 Characters")
    .regex(/^[a-zA-Z\s]*$/, "Last Name must only contain letters and spaces"),
  email: z.string().email("Please enter a valid email"),
  status: z.string().max(64, "Status must not exceed 64 Characters").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 Characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
    ),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 Characters"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
