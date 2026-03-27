import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';

const Sidebar = () => {
  const {getConversations, conversations, selectedConv, setSelectedConv, isConvLoading} = useChatStore();

  const {onlineUsers} = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(()=>{
    getConversations();
    // console.log("user run .. ");
  }, [getConversations])

  const filteredConv = showOnlineOnly ? conversations.filter(conv=> onlineUsers.includes(conv.ouId)) : conversations;
  // const filteredConv = conversations;

  if(isConvLoading){
    return(
     <SidebarSkeleton/>
    )      
  }
  return (
    <aside className='h-full w-18 sm:w-22 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='border-b border-base-300 w-fit p-3'>
        <div className='flex items-center gap-2'>
          <Users className='size-6'/>
          <span className='font-medium hidden lg:block'>Contacts</span>
        </div>
        {/* // filter */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type='checkbox'
              checked={showOnlineOnly}
              onChange={(e)=>setShowOnlineOnly(e.target.checked)}
              className='checkbox checkbox-sm'
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-gray-600">({onlineUsers.length -1} online)</span>

        </div>
      </div>


      <div className='overflow-y-auto w-full py-3'>
        {/* map all user contact */}
        
        {filteredConv.length ===0 
        ? (<div className="text-center text-gray-500">No Users</div>)
        : filteredConv.map((conv) => (
          <button
            key={conv._id}
            onClick={()=> setSelectedConv(conv)}
            className={`w-full sm:p-3 p-1 flex items-center gap-3 hover:bg-base-300 transition-colors
              ${selectedConv?._id == conv._id ? "bg-base-300 ring-1 ring-base-300 " : ""}`}
          >
            <div className='relative mx-auto lg:mx-0'>
              <img 
                src={conv.profilePic || "/avtar.png"} 
                alt={conv.name}
                className='size-13 object-cover rounded-full' 
              />

              {onlineUsers.includes(conv.ouId) && (
                <span 
                  className='absolute bottom-0 right-0 size-2 bg-success
                  rounded-full ring-1 ring-zinc-900'
                />
              )}
            </div>

          {/* user info - lg screen */}
          <div className="hidden lg:block text-left min-w-0 flex-1">
            
            {/* Name + Online Status */}
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{conv.name}</span>
              <span
                className={`text-xs ${
                  onlineUsers.includes(conv.ouId) 
                  ? "text-success " : "text-zinc-400"
                }`}
              >
                {onlineUsers.includes(conv.ouId) ? "online" : "offline"}
              </span>
            </div>

            {/* Last Message + Unread Count */}
            <div className="flex items-center justify-between mt-1">
              
              <p className="text-sm text-zinc-500 truncate max-w-[75%]">
                {conv?.lastMessage}
              </p>

              {conv.unreadCount > 0 && (
                <span className="ml-2 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-xs font-semibold text-white bg-success rounded-full">
                  {conv.unreadCount}
                </span>
              )}

            </div>
          </div>


          </button>
        ))}

      </div>
    </aside>
   
  )
}

export default Sidebar