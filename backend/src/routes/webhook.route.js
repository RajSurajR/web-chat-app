import express from "express";
import { clerkWebhook } from "../controllers/webhook.controller.js";

const webhookRouter = express.Router();

webhookRouter.post("/clerk", clerkWebhook);

export default webhookRouter;