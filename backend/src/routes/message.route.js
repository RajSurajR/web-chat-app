import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getDMMessages, markDMMessagesSeen, sendDMMessage } from "../controllers/dmMessage.controller.js";

const router = express.Router();

// router.get("/users", protectRoute, getUsersForSideabr)
// router.get("/:id", protectRoute, getMessages);
// router.post("/send/:id", protectRoute, sendMessage);

router.post("/dm/:convId", protectRoute, sendDMMessage); // send msg
router.get("/dm/:convId", protectRoute, getDMMessages); // get all msg
router.patch("/dm/seen", protectRoute, markDMMessagesSeen) // mark seen


// TODO
// router.post("/group", requireAuth, protectRoute, sendMessage);
// router.get("/group/:convId", requireAuth, protectRoute, getMessages);
// router.patch("/group/seen/:convId", requireAuth, protectRoute, markAsSeen);
// router.delete("/group/:id", requireAuth, protectRoute, deleteMessage);

export default router;