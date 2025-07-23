import { Router } from "express";

import * as authController from "../controllers/auth.controller.js"

const router = Router();

router.route("/register")
  .get(authController.getRegistrationPage)
  .post(authController.postRegistrationPage);

router.route("/login")
  .get(authController.getLoginPage).
  post(authController.postLogin);

export const authRoute = router;
