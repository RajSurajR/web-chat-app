import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import { X } from 'lucide-react';

const ChatHeader = () => {
    const {selectedConv, setSelectedConv} = useChatStore();
    const {onlineUsers } = useAuthStore();

  return (
     <div className='px-5 py-2 border-b border-base-300 bg-base-100 flex justify-between'>
        <div className='flex items-center gap-3'>
           {/* Avatar */}
            <div className="avatar">
                <div className='size-10 rounded-full relative'>
                    <img src={selectedConv.profilePic || "/avatar.png"} alt={selectedConv.name} />
                </div>
            </div>

            {/* User info */}
            <div>
                <h3 className='font-medium '>{selectedConv.name}</h3>
                <p className={`text-xs ${onlineUsers.includes(selectedConv.ouId)?" text-success":" text-base-content/70"}`}>
                    {onlineUsers.includes(selectedConv.ouId) ? "online" : "offline"}
                </p>
            </div>
        </div>

        <button onClick={()=> setSelectedConv(null)}> <X/></button>

    </div>
  )
}

export default ChatHeader