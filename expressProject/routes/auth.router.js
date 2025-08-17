import { Router } from "express";

import * as authController from "../controllers/auth.controller.js"

const router = Router();

router.route("/register")
  .get(authController.getRegistrationPage)
  .post(authController.postRegistrationPage);

router.route("/login")
  .get(authController.getLoginPage).
  post(authController.postLogin);

router.route('/me').get(authController.getMe);

router.route('/profile').get(authController.getProfilePage);

router.route('/verify-email').get(authController.getVerifyEmailPage);

router.route('/resend-verification-link').post(authController.resendVerificationLink);

router.route('/logout').get(authController.logoutUser);
export const authRoute = router;
