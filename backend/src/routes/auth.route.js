import express from "express";
import { checkAuth } from "../controllers/auth.controller.js";
import { adminProtect, protectRoute } from "../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";
// requireAuth() : allow accessiable this only login user

const router = express.Router();

// router.post("/signup", signup); // import singup function
// router.post("/login", login);
// router.post("/logout", logout);
// router.put("/update-profile", requireAuth, protectRoute, updateProfile);

// router.get("/check", protectRoute, checkAuth);
router.get("/me", protectRoute, checkAuth);
router.get("/admin-auth", requireAuth, protectRoute, adminProtect, checkAuth);


export default router;