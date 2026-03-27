import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import searchUsers from "../controllers/users.controller.js";

const router = express.Router();
// requireAuth, protectRoute,
router.get("/search",  protectRoute, searchUsers);

export default router;