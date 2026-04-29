"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpAndResetPassword = exports.requestPasswordReset = exports.updatePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const user_schema_1 = require("../schemas/user.schema");
const nodeMailer_1 = require("../configs/nodeMailer");
const generateOtp_1 = require("../configs/generateOtp");
const updatePassword = async (req, res) => {
    const result = user_schema_1.updatePasswordSchema.safeParse(req.body);
    try {
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid data!",
                error: result.error.issues,
            });
        }
        const user = await user_model_1.User.findOne({ email: result.data.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
        const isMatch = await user.comparePassword(result.data.currentPassword);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Incorrect Password!" });
        }
        const isSamePassword = await bcryptjs_1.default.compare(result.data.newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password can't be same!",
            });
        }
        user.password = result.data.newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully!",
        });
        (0, nodeMailer_1.sendPasswordUpdateMail)({
            email: user.email,
            username: user.username,
        });
    }
    catch (err) {
        console.log(`Error in the updatePassword controller! ${err.message}`);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.updatePassword = updatePassword;
const requestPasswordReset = async (req, res) => {
    const result = user_schema_1.forgotPasswordSchema.safeParse(req.body);
    try {
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data!",
                error: result.error.issues,
            });
        }
        const user = await user_model_1.User.findOne({ email: result.data.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
        const otp = (0, generateOtp_1.generateOTP)();
        const hashedOTP = await bcryptjs_1.default.hash(otp, 10);
        user.otp = hashedOTP;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();
        res.status(200).json({
            success: true,
            message: "OTP sent successfully!",
        });
        await (0, nodeMailer_1.sendOtpMail)({ email: user.email, username: user.username }, otp);
    }
    catch (err) {
        console.log(`Error in the requestPasswordReset controller! ${err.message}`);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.requestPasswordReset = requestPasswordReset;
const verifyOtpAndResetPassword = async (req, res) => {
    const result = user_schema_1.verifyOtpSchema.safeParse(req.body);
    try {
        if (!result.success) {
            return res.status(400).json({ message: "Invalid data!" });
        }
        const { email, otp, newPassword } = result.data;
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found!" });
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ message: "OTP not found!" });
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP expired!" });
        }
        const isValid = await bcryptjs_1.default.compare(otp, user.otp);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid OTP!" });
        }
        const isSamePassword = await bcryptjs_1.default.compare(result.data.newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password can't be same!",
            });
        }
        user.password = newPassword;
        user.otp = null;
        user.otpExpiry = null;
        await (0, nodeMailer_1.sendForgotPasswordMail)({
            email: user.email,
            username: user.username,
        });
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password reset successfully!",
        });
    }
    catch (err) {
        console.log(`Error in the verifyOtpAndResetPassword controller! ${err.message}`);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.verifyOtpAndResetPassword = verifyOtpAndResetPassword;
//# sourceMappingURL=password.controllers.js.map