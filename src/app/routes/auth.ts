import { Router } from "express";
import { RegisterController } from "../Http/Controllers/Auth/Register";
import { LoginController } from "../Http/Controllers/Auth/Login";
import { LogoutController } from "../Http/Controllers/Auth/Logout";
import { ResetPasswordController } from "../Http/Controllers/Auth/ResetPassword";
import { VerificationController } from "../Http/Controllers/Auth/Verification";

const router = Router();

const register: RegisterController = new RegisterController();
const login: LoginController = new LoginController();
const logout: LogoutController = new LogoutController();
const password: ResetPasswordController = new ResetPasswordController();
const email: VerificationController = new VerificationController();

router.post("/register", register.SignUp);
router.post("/login", login.SignIn);
router.post("/logout", logout.SignOut);
router.post("/refresh", logout.Refresh);
router.get("/password/reset", password.sendResetLinkForm);
router.post("/password/email", password.sendResetLinkEmail);
router.post("/password/reset", password.reset);
router.get("/email/resend", email.resend);
router.get("/email/resend/:id/:hash", email.verify);

export default router;
