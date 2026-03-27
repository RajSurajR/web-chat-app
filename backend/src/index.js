import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors";
import { connectDB } from "./lib/db.js"

import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";
import messageRoutes from "./routes/message.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import friendshipRoutes from "./routes/friendship.route.js";

import {app, server } from "./lib/socket.js";
import path from "path"
import { clerkMiddleware } from '@clerk/express'
import webhookRouter from "./routes/webhook.route.js";


const __dirname = path.resolve();

dotenv.config();
// const app = express();

const PORT = process.env.PORT;

// --/api/webhooks/clerk => api for webhook
app.use("/api/webhooks", express.json(), webhookRouter);

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
  credentials:true,
}));
app.use(cookieParser()); // allow to parse cookies
app.use(express.json({limit:"10mb"}));
app.use(clerkMiddleware());

// ---/api/auth/signup
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/friendship", friendshipRoutes)
app.use("/api/conversation", conversationRoutes)
app.use("/api/messages", messageRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });
}

server.listen(PORT, ()=>{
  connectDB()
  console.log("Sever is running on port : " + PORT);
})

// app.listen(PORT, ()=>{
//     console.log("Sever is running on port : " + PORT);
//     connectDB()
// })