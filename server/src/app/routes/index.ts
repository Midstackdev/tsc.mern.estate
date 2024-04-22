import homeRoute from "./home";
import userRoute from "./user";
import authRoute from "./auth";
import listngRoute from "./listing";

import { Router } from "express";

const router = Router();

router.use("/", homeRoute);
router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/listing", listngRoute);

export const routes = router;
