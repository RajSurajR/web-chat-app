import { Users } from 'lucide-react'
import React from 'react'

const SidebarSkeleton = () => {
  return (
    <div className="w-64 h-full p-4 bg-base-100 border-r border-base-300 flex flex-col gap-4 transition-all">
    {/* side bar head */}
    <div className="skeleton border-b border-base-300 w-full mb-2 animate-pulse p-6">
        <div className='flex items-center gap-2'>
            <Users className='w-6 h-6'/>
            <span className='font-medium hidden lg:block'>Contacts</span>
        </div>
    </div>

    {/* skeleton user row */}
    <div className="flex flex-col gap-3">
        {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full animate-pulse"></div>

            <div className="flex flex-col flex-1 gap-2">
                <div className="skeleton h-4 w-28 animate-pulse"></div>
                <div className="skeleton h-3 w-20 animate-pulse"></div>
            </div>
        </div>
        ))}
    </div>
    </div>


  )
}

export default SidebarSkeleton