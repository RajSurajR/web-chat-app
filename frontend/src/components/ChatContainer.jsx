import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore';
import { formateMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedConv, subscribeToMessage, unsubscribeFromMessage} = useChatStore();
  const {authUser} = useAuthStore();  
  const messageEndRef = useRef(null);

  useEffect(()=>{
    if (!selectedConv?._id) return;
    getMessages(selectedConv._id);
    // subscribeToMessage();
    // console.log("message run..");
    // return () => unsubscribeFromMessage();
  }, [selectedConv._id, getMessages, subscribeToMessage, unsubscribeFromMessage])

  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior:"smooth"});
    }
  }, [messages])

  if(isMessagesLoading){
    return (
      <div className='w-full h-full flex-1 flex flex-col overflow-auto'>
        <ChatHeader/>
        <MessageSkeleton/>
        <MessageInput/>
      </div>
    );
  }
  return (
    <div className='w-full h-full flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      
      {/* // all messages are here; */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message)=> (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? " chat-end" : " chat-start"}`}
            ref={messageEndRef}
          >
            {/* user image  */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img 
                  src={message.senderId === authUser._id 
                    ? authUser.profilePic || "/avatar.png" 
                    : selectedConv.profilePic || "/avatar.png"}
                    alt='profile pic'
                 />
              </div>
            </div>
            {/* message */}
            <div className="chat-header mb-1">
              <time className='text-xs opacity-50 ml-1'>{formateMessageTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img 
                    src={message.image}
                    alt="Attachment"
                    className='sm:max-w-[250px] rounded-md mb-2 self-end' 
                  />
                )}  
                {message.text && <p>{message.text}</p>}
            </div>
            
          </div>
        ))}
      </div>

      <MessageInput/>
    </div>
  )
}

export default ChatContainer
