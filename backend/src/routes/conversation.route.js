import express from "express";
import { createDMConversation, getDMConversations, getDMConversationById, deleteDMConversation, markConversationAsRead} from "../controllers/dmConversation.controller.js";
import {protectRoute }from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/dm", protectRoute, createDMConversation); // create dm conversation
router.get("/dm", protectRoute, getDMConversations); // get all dm list (sidebar)
router.get("/dm/:convId", protectRoute, getDMConversationById);  // get single dm
router.patch("/dm/delete/:convId", protectRoute, deleteDMConversation);
router.patch("/dm/mark", protectRoute, markConversationAsRead);

// TODO : 
// router.post("/group", requireAuth, protectRoute, createConversation); // create group
// router.get("/group", requireAuth, protectRoute, getMyConversations); // get all group
// router.get("/group/:convId", requireAuth, protectRoute, getConversationById); // single group detaile

// router.patch("/group/rename/:convId", requireAuth, protectRoute, dummyReturn); // delete conversation
// router.patch("/group/add-user/:convId", requireAuth, protectRoute, dummyReturn); // delete conversation
// router.patch("/group/remove-user/:convId", requireAuth, protectRoute, dummyReturn); // delete conversation
// const dummyReturn = (req, res) =>{
//     res.status(500).json({"msg":"dummy response"})
// }

export default router;
