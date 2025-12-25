
import express from "express";
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import { saveRedirectUrl } from "../middleware.js";
import UserController from "../controllers/user.js";

const router = express.Router();

/* SIGNUP */
router.get("/signup", UserController.renderSignupForm);

router.post(
  "/signup",
  wrapAsync(UserController.signup)
);

/* LOGIN */
router.get("/login", UserController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(UserController.login)
);

/* LOGOUT */
router.get("/logout", UserController.logout);

export default router;
