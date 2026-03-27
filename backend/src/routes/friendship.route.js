import express from "express";
import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  blockUser,
  unblockUser,
  getFriends,
  deleteFriendship,
} from "../controllers/friendship.controller.js";

import{ protectRoute }from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/request",  protectRoute, sendRequest);
router.patch("/accept/:id", protectRoute, acceptRequest);
router.patch("/reject/:id", protectRoute, rejectRequest);
router.patch("/cancel/:id", protectRoute, deleteFriendship);
router.patch("/block/:id", protectRoute, blockUser);
router.patch("/unblock/:id", protectRoute, unblockUser);
router.get("/", protectRoute, getFriends); // get allfriend, sent list, req list, block list,

export default router;