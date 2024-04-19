import { Router } from "express";
import { controller } from "../Http/Controllers/Listing";

const router = Router();

router.get("/", controller.index);
router.post("/", controller.store);

export default router;
