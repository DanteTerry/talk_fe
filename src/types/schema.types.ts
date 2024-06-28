import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 Characters"),
  lastName: z.string().min(2, "Last Name must be at least 2 Characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 Characters"),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;
