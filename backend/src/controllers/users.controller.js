import mongoose from "mongoose";
import { getErrorResponse, getSuccessResponse } from "../lib/utils.js";
import User from "../models/user.model.js";
import Friendship from "../models/friendshipe.model.js";

const searchUsers = async (req, res) => {
  try {

    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (!query || query.trim().length < 3) {
      return res.status(400).json(getErrorResponse({message: "Search query must be at least 3 characters"}));
    }

     const currentUserId = req.user?._id;
    // const currentUserId = new mongoose.Types.ObjectId(userId);
    const sanitizeQuery = query.trim();

  const searchFilter = {
    $and:[
      {
        $or: [
          { fullName: { $regex: `^${sanitizeQuery}`, $options: "i" } },
          { email: { $regex: sanitizeQuery, $options: "i" } }
        ],
      },
      {_id: { $ne: currentUserId }}
    ]
  };

    const users = await User.find(searchFilter)
      .select("fullName email profilePic") // exclude lastSeen
      .limit(Math.min(limit, 20)) // protect server
      .skip((page - 1) * limit)
      .lean(); // faster response
    
    const userIds = users.map(u=>u._id);
    const friendships = await Friendship.find({
      $or: [
        { requester: currentUserId, recipient: { $in: userIds } },
        { recipient: currentUserId, requester: { $in: userIds } }
      ]
    }).lean();

    const currentIdStr = currentUserId.toString();
    const friendshipMap = new Map();
    friendships.forEach(f => {
      const requester = f.requester.toString();
      const recipient = f.recipient.toString();
      const otherUser = requester === currentIdStr ? recipient : requester;
      let relationshipStatus = "none";

      if (f.status === "accepted") {
        relationshipStatus = "friends";
      }
      else if (f.status === "pending") {
        relationshipStatus = requester === currentIdStr ? "sent" : "received";
      }
      else if (f.status === "blocked") {
        relationshipStatus = (f.blockedBy.toString() !== currentIdStr)?null:"blocked";
      }
      friendshipMap.set(otherUser, relationshipStatus); 
    });

    const results = [];

    for (const user of users) {
      const status = friendshipMap.get(user._id.toString());
      if (status === null) continue; // skip blocked users
      results.push({
        ...user,
        relationshipStatus: status || "none"
      });
    }


    res.status(200).json(getSuccessResponse({data:results, meta:{count: users.length}}));

  } catch (error) {
    res.status(500).json(getErrorResponse({error }));
  }
};

 

export default searchUsers;