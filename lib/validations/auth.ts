import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password needs one uppercase letter")
      .regex(/[a-z]/, "Password needs one lowercase letter"),
    role: z.enum(["customer", "vendor"]),
    businessName: z.string().trim().max(100).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "vendor" && (data.businessName ?? "").length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["businessName"],
        message: "Business name is required for vendors",
      });
    }
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const onboardingSchema = z
  .object({
    role: z.enum(["customer", "vendor"]),
    businessName: z.string().trim().max(100).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "vendor" && (data.businessName ?? "").length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["businessName"],
        message: "Business name is required for vendors",
      });
    }
  });

export type OnboardingValues = z.infer<typeof onboardingSchema>;