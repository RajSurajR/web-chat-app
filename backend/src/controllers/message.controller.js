import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import {io, getReceiverSocketId } from "../lib/socket.js";
import Conversation from "../models/conversation.model.js";


// export const getUsersForSideabr = async (req, res) =>{ // all user get
//     try{
//         const loggedInUserId = req.user._id;
//         const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
//         res.status(200).json(filteredUsers)
//     }catch(error){
//         console.error("Error in getUsersForSidebar : ", error.message);
//         res.status(500).json({error:"Internal server error"});
//     }
// }


// export const getMessages1 = async(req, res) =>{
//     try{
//         const { id:userToChatId } = req.params
//         const myId = req.user._id;

//         const messages = await Message.find({
//             $or:[
//                 {senderId:myId, receiverId:userToChatId}, // i ams sender
//                 {senderId:userToChatId, receiverId:myId} // i am receiver
//             ]
//         })
        
//         res.status(200).json(messages);
//     }catch(error){
//         console.log("error in getMessages Controller : ", error.message);
//         res.status(500).json({error:"Internal server error" });
//     }
// }   

// export const sendMessage1 = async(req, res) =>{
//     try{
//         const {text , image} = req.body;
//         const {id:receiverId} = req.params;
//         const senderId = req.user._id;

//         let imageUrl;
//         if(image){
//             // Uloadimage to cloudinary
//             const uploadResponse = await cloudinary.uploader.upload(image);
//             imageUrl = uploadResponse.secure_url;
//         }

//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             text,
//             image:imageUrl,
//         });

//         await newMessage.save();

//         // realtime communcation.
//         const receiverSocketId =  getReceiverSocketId(receiverId);
//         if(receiverSocketId){
//             // console.log("server socket send");
//             io.to(receiverSocketId).emit("newMessage", newMessage);
//         }

//         res.status(201).json(newMessage);

//     }catch(error){
//         console.log("Error in sendMessage controller : ", error.message);
//         res.status(500).json({error: "Internal server error"});
//     }
// }

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { conversationId, text, image } = req.body;

    let imageUrl;
    if(image){ // Uloadimage to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const message = await Message.create({
      conversationId,
      senderId,
      text,
      image:imageUrl,
      seenBy: [senderId],
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    // realtime communcation.
    const receiverSocketId =  getReceiverSocketId(receiverId);
    if(receiverSocketId){
        // console.log("server socket send");
        io.to(receiverSocketId).emit("newMessage", message);
    }
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const limit = Number(req.query.limit) || 50;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    await Message.updateMany(
      { conversationId, seenBy: { $ne: userId } },
      { $push: { seenBy: userId } }
    );

    res.json({ message: "Seen updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const message = await Message.findById(req.params.id);

    if (!message || !message.senderId.equals(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await message.deleteOne();
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};