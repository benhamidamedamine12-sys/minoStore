const express = require("express");
const passport = require("passport");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const isAuth = require("../middlewares/isAuth");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  validation,
} = require("../middlewares/validators");

// Routes classiques
router.post(
  "/register",
  ...registerValidation(),
  validation,
  authController.register
);

router.post(
  "/login",
  ...loginValidation(),
  validation,
  authController.login
);

router.post(
  "/logout", authController.logout); // ← NOUVEAU

router.get(
  "/me", 
  isAuth, 
  authController.getMe
);

router.post(
  "/forgot-password",
  ...forgotPasswordValidation(),
  validation,
  authController.forgotPassword
);

router.post(
  "/reset-password/:token",
  ...resetPasswordValidation(),
  validation,
  authController.resetPassword
);

router.get(
  "/verify-email/:token", 
  authController.verifyEmail
);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);  


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login?error=google_auth_failed",
    session: false,
  }),
  authController.googleCallback
);

module.exports = router;