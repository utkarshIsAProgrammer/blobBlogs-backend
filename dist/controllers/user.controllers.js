"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../models/user.model");
const user_schema_1 = require("../schemas/user.schema");
const nodeMailer_1 = require("../configs/nodeMailer");
const deleteAccount = async (req, res) => {
    const { id } = req.params;
    const result = user_schema_1.deleteAccountSchema.safeParse(req.body);
    try {
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid id format!");
        }
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data!",
            });
        }
        const user = await user_model_1.User.findOne({ email: result.data.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
        const isMatch = await user.comparePassword(result.data.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials!",
            });
        }
        await user_model_1.User.findByIdAndDelete(id);
        (0, nodeMailer_1.sendDeletionMail)({
            email: user.email,
            username: user.username,
        });
        res.status(200).json({
            success: true,
            message: "Account deleted successfully!",
        });
    }
    catch (err) {
        console.log(`Error in the deleteAccount controller! ${err.message}`);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=user.controllers.js.map