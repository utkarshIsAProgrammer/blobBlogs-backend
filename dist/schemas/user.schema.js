"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountSchema = exports.verifyOtpSchema = exports.forgotPasswordSchema = exports.updatePasswordSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters long!")
        .max(100, "Name must be less than 100 characters!")
        .trim(),
    email: zod_1.z.string().email("Invalid email format!").trim().lowercase(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long!")
        .regex(/[A-Z]/, "Must include uppercase letter!")
        .regex(/[a-z]/, "Must include lowercase letter!")
        .regex(/[0-9]/, "Must include number!")
        .regex(/[^A-Za-z0-9]/, "Must include special character!"),
});
exports.signupSchema = userSchema;
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format!").trim().lowercase(),
    password: zod_1.z.string().min(1, "Password is required!"),
});
exports.updatePasswordSchema = zod_1.z
    .object({
    email: zod_1.z.string().email("Invalid email format!").trim().lowercase(),
    currentPassword: zod_1.z.string().min(1, "Current password is required!"),
    newPassword: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long!")
        .regex(/[A-Z]/, "Must include uppercase letter!")
        .regex(/[a-z]/, "Must include lowercase letter!")
        .regex(/[0-9]/, "Must include number!")
        .regex(/[^A-Za-z0-9]/, "Must include special character!"),
    confirmPassword: zod_1.z.string(),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format!").trim().lowercase(),
});
exports.verifyOtpSchema = zod_1.z
    .object({
    email: zod_1.z.string().email("Invalid email format!").trim().lowercase(),
    otp: zod_1.z.string(),
    newPassword: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long!")
        .regex(/[A-Z]/, "Must include uppercase letter!")
        .regex(/[a-z]/, "Must include lowercase letter!")
        .regex(/[0-9]/, "Must include number!")
        .regex(/[^A-Za-z0-9]/, "Must include special character!"),
    confirmPassword: zod_1.z.string(),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
});
exports.deleteAccountSchema = exports.loginSchema;
//# sourceMappingURL=user.schema.js.map