import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";


export const protectRoute = async(req, res, next) =>{
 try {
    const { userId } = getAuth(req); 
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId:userId });
    if (!user) {
      return res.status(404).json({ message: "Unauthorized - Something went wrong" });
    }
    req.user = user;
    // console.log(`[DEBUG] Method: ${req.method} | URL: ${req.originalUrl}`);
    return next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admin access required" });
  }
};

// export const protectRoute = async(req, res, next) =>{
//     try{
//         const token = req.cookies.jwt;
//         if(!token){
//             return res.status(401).json({message:"Unauthorized - No Token Provided"});
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if(!decoded){
//             return res.status(401).json({message:"Unauthorized - Invalid Token"});
//         }
//         const user = await User.findById(decoded.userId).select("-password"); // not send password to client
//         if(!user){
//             return res.status(404).json({message:"User not found"});
//         }
//         req.user = user;
//         next();
//     }catch(error){
//         console.log("Error in protectRoute middleware: ", error.message);
//         res.status(500).json({message:"Internal server error"});
//     }
// }