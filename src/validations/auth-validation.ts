import z from "zod";


export const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email('Please enter a valid email'),
    password: z.string().min(8, { message: "Password is required" }),
}
);

export type LoginForm = z.infer<typeof loginSchema>;