import { Router } from "express";
import { controller } from "../Http/Controllers/Listing";
import { protect } from "../Http/Middleware/protected";

const router = Router();

router.get("/", controller.index);
router.post("/", protect, controller.store);
router.delete("/:id", protect, controller.remove);
router.delete("/image/:id", protect, controller.removeImage);
router.patch("/:id", protect, controller.update);
router.get("/user/:id", protect, controller.userListings);

export default router;
