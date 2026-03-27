import mongoose from "mongoose";
import Friendship from "../models/friendshipe.model.js";
import { getErrorResponse, getSuccessResponse } from "../lib/utils.js";

export const sendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { userId } = req.body;

    if (!userId || senderId.toString() === userId) {
      return res.status(400).json(getErrorResponse({ message: "Invalid user" }));
    }
    const receiverId = new mongoose.Types.ObjectId(userId);

    const exists = await Friendship.findOne({
      $or: [
        { requester: senderId, recipient: receiverId },
        { requester: receiverId, recipient: senderId }
      ]
    });

    if (exists) {
      return res.status(400).json(getErrorResponse({ message: "Request or friendship already exists" }));
    }

    const friendship = await Friendship.create({
      requester: senderId,
      recipient: receiverId,
      status: "pending"
    });

    res.status(201).json(getSuccessResponse({ message: "Request Sent", data: friendship }));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json(getErrorResponse({ message: "Request already exists (Duplicate)", error, code: "DUPLICATE_REQUEST" }));
    }
    res.status(500).json(getErrorResponse({ error }));
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const participantsId = req.params.id;
    const friendship = await Friendship.findById(participantsId);

    if (!friendship) {
      return res.status(404).json(getErrorResponse({ message: "Request not found" }));
    }

    if (friendship.status !== "pending") {
      return res.status(400).json(getErrorResponse({ message: "Invalid request state" }));
    }

    if (friendship.recipient.toString() !== userId.toString()) {
      return res.status(403).json(getErrorResponse({ message: "Not allowed" }));
    }

    friendship.status = "accepted";
    await friendship.save();

    res.json(getSuccessResponse({ message: "You Accepted Request", data: friendship }));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};
export const rejectRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const participantsId = req.params.id;
    const friendship = await Friendship.findById(participantsId);

    if (!friendship) {
      return res.status(404).json(getErrorResponse({ message: "Request not found" }));
    }

    if (friendship.status !== "pending") {
      return res.status(400).json(getErrorResponse({ message: "Cannot reject this request" }));
    }
    
    if ( friendship.requester.toString() !== userId.toString() && 
    friendship.recipient.toString() !== userId.toString()) {
      return res.status(403).json(getErrorResponse({ message: "Not allowed" }));
    }
    
    await friendship.deleteOne();
    res.status(200).json(getSuccessResponse({ message: "Request rejected", data: friendship }));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};
export const blockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const participantsId = req.params.id;
    const friendship = await Friendship.findById(participantsId);

    if (!friendship) {
      return res.status(404).json(getErrorResponse({ message: "Request not found" }));
    }

    if (
        friendship.requester.toString() !== userId.toString() && 
        friendship.recipient.toString() !== userId.toString()
    ) {
      return res.status(403).json(getErrorResponse({ message: "Not allowed" }));
    }

    friendship.status = "blocked";
    friendship.blockedBy = userId;
    await friendship.save();

    res.status(200).json(getSuccessResponse({ message: "User blocked", data: friendship }));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};
export const unblockUser = async (req, res) => {
  try {
    const userId = req.user._id; 
    const participantsId = req.params.id;
    const friendship = await Friendship.findById(participantsId);

    if (!friendship) {
      return res.status(404).json(getErrorResponse({ message: "Not found" }));
    }
    if (friendship.status !== "blocked") {
      return res.status(400).json(getErrorResponse({ message: "Invalid request state" }));
    }
    
    // Only the person who DID the blocking can unblock
    if (friendship.blockedBy.toString() !== userId.toString())  {
      return res.status(403).json(getErrorResponse({ message: "Not allowed to unblock" }));
    }

    await friendship.deleteOne();
    res.json(getSuccessResponse({ message: "User unblocked", data: friendship }));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.query;
    let filter = {};

    if (type === "friends") {
      filter = {
        $or: [{ requester: userId }, { recipient: userId }],
        status: "accepted"
      };
    } else if (type === "sent") {
      filter = {
        requester: userId,
        status: "pending"
      };
    } else if (type === "received") {
      filter = {
        recipient: userId,
        status: "pending"
      };
    } else if (type === "blocked") {
      filter = {
        blockedBy: userId,
        status: "blocked"
      };
    } else {
      return res.status(400).json(getErrorResponse({ message: "Invalid Request type" }));
    }

    // We must populate BOTH fields because the "friend" could be in either position
    const data = await Friendship.find(filter)
      .populate("requester", "email fullName profilePic")
      .populate("recipient", "email fullName profilePic");

    res.json(getSuccessResponse({ data }));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};
export const deleteFriendship = async (req, res) => {
  try {
    const userId = req.user._id;
    const participantsId = req.params.id;
    const friendship = await Friendship.findById(participantsId);

    if (!friendship) {
      return res.status(404).json(getErrorResponse({ message: "Request not found" }));
    }
    
    if ( friendship.requester.toString() !== userId.toString() && 
    friendship.recipient.toString() !== userId.toString()) {
      return res.status(403).json(getErrorResponse({ message: "Not allowed" }));
    }
    
    await friendship.deleteOne();
    res.status(200).json(getSuccessResponse({ message: "Friendship Deleted", data: friendship }));
  } catch (error) {
    res.status(500).json(getErrorResponse({ error }));
  }
};