import { Router } from "express";
import { UserController } from "../Http/Controllers/UserController";
import { rateLimit } from "../Http/Middleware/rateLimit";
import { upload } from "../Http/Middleware";
import { protect } from "../Http/Middleware/protected";
import { OtpController } from "../Http/Controllers/Auth/Otp";
import { TwoFactorController } from "../Http/Controllers/Auth/TwoFactor";
import { checkPermission, checkRole } from "../Http/Middleware/rbac";

const router = Router();

const controller: UserController = new UserController();
const otp: OtpController = new OtpController();
const totp: TwoFactorController = new TwoFactorController();

router.get(
  "/",
  //   protect,
  rateLimit({ time: 60, limit: 3 }),
  //   checkRole("ADMIN"),
  //   checkPermission("rule_record"),
  controller.index
);
router.post("/", controller.store);
router.post("/avatar", upload, controller.avatar);
router.get("/:id", protect, controller.get);
router.put("/:id", protect, controller.update);
router.get("/otp/send", protect, otp.sendCode);
router.post("/otp/verify", protect, otp.verifyCode);
router.post("/totp/enable", protect, totp.enable);
router.post("/totp/verify", protect, totp.verifies);
router.post("/totp/validate", protect, totp.validates);
router.post("/totp/disable", protect, totp.disable);

export default router;
