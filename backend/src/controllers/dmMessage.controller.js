import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getErrorResponse, getSuccessResponse } from "../lib/utils.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";
import Friendship from "../models/friendshipe.model.js";

export const sendDMMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { convId } = req.params;
    const {text, image } = req.body;

    if(!mongoose.Types.ObjectId.isValid(convId)) {
      return res.status(400).json({ message: "Invalid conversation Request" });
    }

    if (!text && !image) {
      return res.status(400).json(getErrorResponse({ message: "Message is empty" }));
    }
    
    const conversation = await Conversation.findOne({
      _id: convId,
      participants: senderId,
      isGroup: false,
    });

    if(!conversation || conversation.participants.length !==2) {
      return res.status(403).json(getErrorResponse({ message: "Not allowed" }));
    }
    const receiverId = conversation.participants[0].toString() === senderId.toString()
            ? conversation.participants[1]  
            : conversation.participants[0];

    const friendship = await Friendship.findOne({
      $or: [
        { requester: senderId, recipient: receiverId },
        { requester: receiverId, recipient: senderId },
      ],
      status: "accepted",
    });
    if (!friendship) {
      return res.status(403).json(getErrorResponse({ message: "Not friends" }));
    } 

    let imageUrl = null;
    if(image){
        // Uloadimage to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }
    const message = await Message.create({
      conversationId:convId,
      senderId,
      text,
      image:imageUrl,
      seenBy: [senderId],
    });
 
    const receiverSocketId =  getReceiverSocketId(receiverId);
    if(receiverSocketId){
        console.log("server socket send");
        io.to(receiverSocketId).emit("newMessage", message);
    }

    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json(getSuccessResponse({message:"Message Send", data:message}));
  } catch (error) {
    res.status(500).json(getErrorResponse({error}));
  }
};

export const getDMMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { convId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(convId)) {
      return res.status(400).json({ message: "Invalid conversation Request" });
    }

    const conversation = await Conversation.findOne({
      _id: convId,
      participants: userId,
      isGroup: false,
    });

    if (!conversation) {
      return res.status(403).json(getErrorResponse({ message: "Not allowed" }));
    }

    const messages = await Message.find({ conversationId:convId }).sort({ createdAt: 1 });

    res.status(200).json(getSuccessResponse({message:"Message fetched", data:messages}));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};

export const markDMMessagesSeen = async (req, res) => {
  try {
    const userId = req.user._id;
    const { convId } = req.body;

    await Message.updateMany(
      {
        conversationId:convId,
        seenBy: { $ne: userId },
      },
      {
        $push: { seenBy: userId },
      }
    );

    res.json(getSuccessResponse({ message: "Messages marked as seen" }));
  } catch (error) {
    res.status(500).json(getErrorResponse({error}));
  }
};


