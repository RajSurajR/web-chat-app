import { MessageSquareQuote } from 'lucide-react'
import React from 'react'

const NoChatContainer = () => {
  return (
    <aside className="flex-1 h-full w-full flex flex-col justify-center items-center text-center p-6 bg-base-200 rounded-xl">

      {/* Icon */}
      <div className="p-4 bg-base-100 shadow rounded-full mb-4 animate-pulse">
        <MessageSquareQuote className="w-8 h-8 text-primary" />
      </div>

      {/* Main Heading */}
      <h1 className="text-2xl font-bold text-primary mb-2">
        Welcome to Chatio
      </h1>


      {/* Description Text */}
      <p className="text-base-content/70 max-w-md">
        Select a conversation from the sidebar to start chatting.
      </p>

    </aside>

  )
}

export default NoChatContainer