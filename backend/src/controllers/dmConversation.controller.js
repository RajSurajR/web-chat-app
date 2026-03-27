import mongoose from "mongoose";
import { getErrorResponse, getSuccessResponse } from "../lib/utils.js";
import Conversation from "../models/conversation.model.js";
import Friendship from "../models/friendshipe.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const createDMConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const {otherUserId }= req.body;

    if (!userId || !otherUserId || userId.toString() === otherUserId.toString()) {
      return res.status(400).json(getErrorResponse({ message: "Invalid user" }));
    }
    const otherUser = await User.findById(otherUserId).select("_id");
    if (!otherUser) {
      return res.status(404).json(getErrorResponse({ message: "User not found" }));
    }

    const friendship = await Friendship.findOne({
      $or: [
        { requester: userId, recipient: otherUserId },
        { requester: otherUserId, recipient: userId }
      ],
      status: "accepted"
    });
    
    if (!friendship) {
      return res.status(403).json(getErrorResponse({ message: "Not friends" }));
    }
    
    const participants = [userId, otherUserId].sort();
    const key = participants.join("_");
    // Check existing DM
    let conversation = await Conversation.findOne({ dmKey: key });

    let isNew = false;
    if(!conversation) {
      conversation = await Conversation.create({
        participants,
        isGroup: false,
      });
      isNew = true;
    }

    res.status(isNew ? 201 : 200).json(getSuccessResponse({
      message: isNew ? "Conversation created" : "Conversation exists",
       data:conversation
    }));
  } catch (error) {
    res.status(500).json(getErrorResponse({error}));
  }
};

export const getDMConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const conversations = await Conversation.find({
      participants:userId,
      isGroup: false,
    }).populate("participants", "fullName profilePic")
      .populate("lastMessage", "text createdAt sender")
      .sort({ updatedAt: -1 });

    res.status(200).json(getSuccessResponse({message:"Conversation fetched", data:conversations}));
  } catch (error) {
    res.status(500).json(getErrorResponse({error}));
  }
};

export const getDMConversationById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { convId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(convId)) {
      return res.status(400).json({ message: "Invalid conversation Request" });
    }

    // Check existing DM
    const conversation = await Conversation.findOne({
      _id: convId,
      participants: userId,
      isGroup: false,
    }).populate("participants", "fullName profilePic");

    if (!conversation) {
      return res.status(404).json(getErrorResponse({ message: "Conversation not found" }));
    }

    res.status(200).json(getSuccessResponse({message:"Conversation found", data:conversation}));
  } catch (error) {
    res.status(500).json(getErrorResponse({error}));
  }
};

export const deleteDMConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { convId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(convId)) {
      return res.status(400).json(getErrorResponse({ message: "Invalid Request" }));
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: convId, participants: userId, isGroup: false },
      { $pull: { participants: userId } },  // remove user from participants
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json(getErrorResponse({ message: "Conversation not found" }));
    }

    res.status(200).json(getSuccessResponse({ message: "Conversation deleted" }));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};

export const markConversationAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { convId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(convId)) {
      return res.status(400).json(getErrorResponse({ message: "Invalid ID" }));
    }

    await Message.updateMany(
      { conversationId: convId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json(getSuccessResponse({ message: "Marked as read" }));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};
