"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRoutes = void 0;
const express_1 = __importDefault(require("express"));
const password_controllers_1 = require("../controllers/password.controllers");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
exports.passwordRoutes = router;
router.post("/update-password", auth_middleware_1.protect, password_controllers_1.updatePassword);
router.post("/request-password-reset", password_controllers_1.requestPasswordReset);
router.post("/verify-otp", password_controllers_1.verifyOtpAndResetPassword);
//# sourceMappingURL=password.routes.js.map