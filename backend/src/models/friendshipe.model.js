import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    requester: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);


// 1. Prevents duplicate requests from A to B
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
// index for requester , recipient , blockedBy
friendshipSchema.index({ requester: 1, status: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });
friendshipSchema.index( { blockedBy: 1 }, { partialFilterExpression: { status: "blocked" } });

const Friendship = mongoose.model("Friendship", friendshipSchema);
export default Friendship;