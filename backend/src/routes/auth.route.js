import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup); // import singup function

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
// (first-protect(middleware), second-workFunction)

router.get("/check", protectRoute, checkAuth);

export default router;