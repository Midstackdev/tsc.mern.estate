import { Router } from "express";
import { controller } from "../Http/Controllers/Listing";
import { protect } from "../Http/Middleware/protected";

const router = Router();

router.get("/", controller.index);
router.post("/", protect, controller.store);
router.get("/:id", controller.show);
router.delete("/:id", protect, controller.remove);
router.delete("/image/:id", protect, controller.removeImage);
router.put("/:id", protect, controller.update);
router.get("/user/:id", protect, controller.userListings);

export default router;
