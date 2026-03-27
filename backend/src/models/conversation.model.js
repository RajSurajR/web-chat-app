import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],

    isGroup: { type: Boolean, default: false },
    groupName: { type: String,
      required: function () { return this.isGroup; }, 
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    lastMessage: { type: mongoose.Schema.Types.ObjectId,  ref: "Message",},
    dmKey: { type: String, unique: true, sparse: true
  },
  },
  { timestamps: true }
);
conversationSchema.pre("save", function () {
  if (!this.isGroup) {
    const sorted = [...this.participants].sort();
    this.participants = sorted;
    this.dmKey = `${sorted[0]}_${sorted[1]}`;
  }
});
// for fast query
conversationSchema.index({ participants: 1, updatedAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;