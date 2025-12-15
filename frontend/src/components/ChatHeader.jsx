import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import { X } from 'lucide-react';

const ChatHeader = () => {
    const {selectedUser, setSelectedUser} = useChatStore();
    const {onlineUsers } = useAuthStore();

  return (
     <div className='px-5 py-2 border-b border-base-300 bg-base-100 flex justify-between'>
        <div className='flex items-center gap-3'>
           {/* Avatar */}
            <div className="avatar">
                <div className='size-10 rounded-full relative'>
                    <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                </div>
            </div>

            {/* User info */}
            <div>
                <h3 className='font-medium '>{selectedUser.fullName}</h3>
                <p className='text-xs text-base-content/70'>
                    {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                </p>
            </div>
        </div>

        <button onClick={()=> setSelectedUser(null)}> <X/></button>

    </div>
  )
}

export default ChatHeader