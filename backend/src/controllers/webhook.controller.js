import { Webhook } from "svix";
import User from "../models/user.model.js"; 

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Error occurred -- no svix headers" });
  }

  const payload = req.body;
  const body = JSON.stringify(payload);

  const webhook = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    //  Verify the signature
    evt = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch(err){
    console.error("Error verifying webhook:", err);
    return res.status(400).json({ error: "Error occurred" });
  }

  const eventType = evt.type;
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0].email_address;
    if(!id || !email || (!first_name && !last_name)){
      return res.status(500).json({message:"data is undefined"});
    }

    try {
   
      const newUser = await User.create({
        clerkId: id,
        email: email,
        fullName: `${first_name || ""} ${last_name || ""}`.trim(),
        profilePic: image_url || "",
        role: "user"
      });

      // console.log(`User created in DB: ${newUser.email}`);
      
      return res.status(200).json({ message: "User created" });
    } catch (err) {
      // console.log("Error saving user to DB:", err);
      return res.status(500).json({ error: "Database error" });
    }
  }else if(eventType==="user.updated"){
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0].email_address;
    if(!id || !email || (!first_name && !last_name)){
      return res.status(500).json({message:"data is undefined"});
    }

    try{
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          fullName: `${first_name || ""} ${last_name || ""}`.trim(),
          profilePic: image_url,
          email: email,
        },
      );
      // console.log("update..");
      return res.status(200).json({msg:"user updated"});
    
    }catch(error){
      // console.log("error in update profile : ", error);
      return res.status(500).json({message:"Internal server error"});  
    }
  }

  return res.status(200).json({ message: "Event received" });
};