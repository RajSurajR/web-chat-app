import {config} from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    password: "123456"
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    password: "123456"
  },
  {
    fullName: "Michael Johnson",
    email: "michael.johnson@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
    password: "123456"
  },
  {
    fullName: "Emily Davis",
    email: "emily.davis@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
    password: "123456"
  },
  {
    fullName: "Daniel Brown",
    email: "daniel.brown@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
    password: "123456"
  },
  {
    fullName: "Sophia Wilson",
    email: "sophia.wilson@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
    password: "123456"
  },
  {
    fullName: "David Miller",
    email: "david.miller@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
    password: "123456"
  },
  {
    fullName: "Olivia Anderson",
    email: "olivia.anderson@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
    password: "123456"
  },
  {
    fullName: "James Taylor",
    email: "james.taylor@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
    password: "123456"
  },
  {
    fullName: "Ava Martinez",
    email: "ava.martinez@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
    password: "123456"
  }
];

const seedDatabase = async()=>{
    try{
        await connectDB();

        await User.insertMany(seedUsers);
        console.log("database seeded successfully");
    }catch(error){
        console.error("Error seeding database ", error);
    }
};

// call
seedDatabase();