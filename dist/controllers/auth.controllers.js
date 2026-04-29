"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = exports.getAll = void 0;
const user_model_1 = require("../models/user.model");
const user_schema_1 = require("../schemas/user.schema");
const nodeMailer_1 = require("../configs/nodeMailer");
const getAll = async (req, res) => {
    try {
        const users = await user_model_1.User.find();
        return res.status(200).json({
            success: true,
            mesage: "All users fetched successfully!",
            users,
        });
    }
    catch (err) {
        console.log(`Error in the getAll users controller! ${err.message}`);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.getAll = getAll;
const signup = async (req, res) => {
    const result = user_schema_1.signupSchema.safeParse(req.body);
    try {
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid data",
                error: result.error.issues,
            });
        }
        const userExists = await user_model_1.User.findOne({
            email: result.data.email,
        });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists!",
            });
        }
        const user = new user_model_1.User(result.data);
        await user.save();
        const token = user?.signToken();
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        (0, nodeMailer_1.sendWelcomeMail)({
            email: user.email,
            username: user.username,
        });
        res.status(201).json({
            success: true,
            message: "User created successfully!",
            ...user.toObject(),
            password: undefined,
        });
    }
    catch (err) {
        console.log(`Error in the signup controller! ${err.message}`);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const result = user_schema_1.loginSchema.safeParse(req.body);
    try {
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid data",
                error: result.error.issues,
            });
        }
        const user = await user_model_1.User.findOne({
            email: result.data.email,
        });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User doesn't exists!" });
        }
        const isMatch = await user.comparePassword(result.data.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials!" });
        }
        const token = user.signToken();
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "User logged in  successfully!",
            ...user.toObject(),
            password: undefined,
        });
    }
    catch (err) {
        console.log(`Error in the login controller! ${err.message}`);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully!",
        });
    }
    catch (err) {
        console.log(`Error in the logout controller! ${err.message}`);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controllers.js.map