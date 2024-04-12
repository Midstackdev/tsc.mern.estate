import { Router } from "express";
import { HomeController } from "../Http/Controllers/Home";

const router = Router();

const controller: HomeController = new HomeController();

router.get("/", controller.index);

export default router;
