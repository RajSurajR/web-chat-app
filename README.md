# 💬 Real-Time Chat Application

## 🚀 MERN \| Socket.IO \| Clerk \| Cloudinary

A scalable **real-time one-to-one chat application** built using the
MERN stack. The app enables users to connect through a controlled
friendship system and exchange messages instantly with support for
offline delivery and read receipts.

------------------------------------------------------------------------

## 📌 Features

### 🔐 Authentication

-   Secure authentication using **Clerk**
-   User onboarding handled via **webhooks**
-   Protected backend routes with middleware

### 👥 Friendship System (Permission Layer)

-   Send, accept, reject, and block friend requests
-   Prevent duplicate requests using MongoDB indexing
-   Only connected users can start conversations

### 💬 One-to-One Conversations (DM)

-   Unique conversation per user pair (DB-level enforcement)
-   Lazy conversation creation (no empty chats)
-   Chat list with last message preview

### ⚡ Real-Time Messaging

-   Instant messaging using Socket.IO
-   Online/offline user presence tracking
-   Real-time updates

### 📨 Message System

-   Text and image messages (Cloudinary)
-   MongoDB persistence
-   Offline message delivery

------------------------------------------------------------------------

## 🧠 Architecture & Design

-   **Friendship** → permission layer\
-   **Conversation** → chat container\
-   **Message** → actual content

### Key Decisions

-   One DM per user pair using partial unique index\
-   Lazy conversation creation\
-   Indexed queries for performance\
-   Populate for relational-style data

------------------------------------------------------------------------

## 🔄 Application Flow

1.  User searches users\
2.  Sends friend request\
3.  Request accepted\
4.  Conversation starts on first message\
5.  Messages sent in real-time or stored\
6.  Seen status updated

------------------------------------------------------------------------

## 🛠️ Tech Stack

Frontend: React.js\
Backend: Node.js, Express.js\
Database: MongoDB\
Real-Time: Socket.IO\
Auth: Clerk\
Media: Cloudinary

------------------------------------------------------------------------

## 📡 API Overview

### Friendship

-   POST /friends/request\
-   PATCH /friends/accept/:id\
-   PATCH /friends/reject/:id\
-   PATCH /friends/block/:id\
-   GET /friends

### Conversations

-   POST /dm/conversations\
-   GET /dm/conversations\
-   GET /dm/conversations/:id

### Messages

-   POST /dm/messages\
-   GET /dm/messages/:conversationId\
-   PATCH /dm/messages/seen

------------------------------------------------------------------------

## 📈 Future Improvements
-   Group chat\
-   Typing indicators\
-   Notifications\
-   Audio/video calling

