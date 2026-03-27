import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { participants, isGroup, groupName } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: "Invalid participants" });
    }

    if (!isGroup && participants.length !== 2) {
      return res.status(400).json({ message: "DM must have 2 users" });
    }

    const allParticipants = [...new Set([...participants, userId])].sort();

    // DM → return existing if found
    if (!isGroup) {
      const existing = await Conversation.findOne({
        participants: allParticipants,
        isGroup: false,
      });

      if (existing) return res.json(existing);
    }

    const conversation = await Conversation.create({
      participants: allParticipants,
      isGroup,
      groupName: isGroup ? groupName : null,
      groupAdmin: isGroup ? userId : null,
    });

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find(
        { participants: userId,}
    ).populate("participants", "name profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const userId = req.user._id;
    const convId = req.params.id;
    const conversation = await Conversation.findById(convId)
      .populate("participants", "name profilePic")
      .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.some(p => p._id.equals(userId))) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { groupName, addUserId, removeUserId } = req.body;
    const convId = req.params.id;

    const conversation = await Conversation.findById(convId);

    if (!conversation || !conversation.isGroup) {
      return res.status(400).json({ message: "Invalid group" });
    }

    if (!conversation.groupAdmin.equals(userId)) {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    if (groupName) conversation.groupName = groupName;

    if (addUserId && !conversation.participants.includes(addUserId)) {
      conversation.participants.push(addUserId);
    }

    if (removeUserId) {
      conversation.participants = conversation.participants.filter(
        id => id.toString() !== removeUserId
      );
    }

    await conversation.save();
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const leaveConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const convId = req.params.id;
    const conversation = await Conversation.findById(convId);

    if (!conversation) {
      return res.status(404).json({ message: "Not found" });
    }

    // DM → soft delete logic (frontend hides it)
    if (!conversation.isGroup) {
      return res.json({ message: "Conversation hidden" });
    }

    // Group → remove user
    conversation.participants = conversation.participants.filter(
      id => id.toString() !== userId.toString()
    );

    await conversation.save();
    res.json({ message: "Left group" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


