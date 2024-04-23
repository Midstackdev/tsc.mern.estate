import { Router } from "express";
import { controller } from "../Http/Controllers/Listing";
import { protect } from "../Http/Middleware/protected";

const router = Router();

router.get("/", controller.index);
router.post("/", controller.store);
router.get("/user/:id", protect, controller.userListings);

export default router;
