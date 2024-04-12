import homeRoute from "./home";
import userRoute from "./user";
import authRoute from "./auth";

import { Router } from "express";

const router = Router();

router.use("/", homeRoute);
router.use("/user", userRoute);
router.use("/auth", authRoute);

export const routes = router;
