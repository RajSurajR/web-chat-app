import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
userSchema.index({ fullName: 1 });
// const userSchema = new mongoose.Schema(
//     {
//         email:{ type:String, required:true, unique:true, },
//         fullName :{ type:String, required:true,minlength:5, },
//         password:{type:String, required : true,minlength:6, },
//         profilePic:{    type:String, default:"",},
//     },
//     {timestamps:true}
// );

const User = mongoose.model("User", userSchema);
// create database collection : Users (pulral)

export default User;