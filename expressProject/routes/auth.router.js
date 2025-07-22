import { Router } from "express";

import * as authController from "../controllers/auth.controller.js"

const router = Router();

router.get("/register", authController.getRegistrationPage);
// router.get("/login", authController.getLoginPage);

// router.post("/login", authController.postLogin)

router.route("/login").get(authController.getLoginPage).post(authController.postLogin);

export const authRoute = router;
