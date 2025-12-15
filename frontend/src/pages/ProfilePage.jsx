import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, MailIcon, User } from 'lucide-react';

const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImg,  setSelectedImg] = useState(null);
  
  const handleImageUpload = async(e) =>{
    const file = e.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async() =>{
      const base64Image = reader.result;
      setSelectedImg(base64Image)
      await updateProfile({profilePic:base64Image});
    }
  };

  return (
    <div className='pt-18 pb-5'>

   
    <div className="sm:w-1/2 w-10/12 mx-auto font-sans flex flex-col items-center bg-base-200 text-base-content rounded-2xl p-2">

      {/* Main Heading */}
      <h2 className="text-2xl font-bold text-center mb-3 text-base-content">Profile</h2>

      {/* Profile Info Section */}
      <h3 className="text-xl font-semibold mt-3 mb-3 text-base-content">Your Profile Info</h3>

      {/* Profile Image + Edit Icon */}
      <div className="relative h-28">
        <img
          src={selectedImg || authUser.profilePic || "/avtar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border border-base-300"
        />

        <label
          htmlFor="avtar-upload"
          className={`absolute bottom-1 right-1 bg-base-100 shadow p-1 rounded-full cursor-pointer text-sm 
            ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
        >
          <Camera className="w-4 h-4 text-base-content" />
          <input
            type="file"
            id="avtar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUpdatingProfile}
          />
        </label>
      </div>

      <p className="text-sm opacity-70">
        {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
      </p>

      <div className="flex items-center gap-5 mt-6">
        <div className="md:w-[360px] text-base-content">
          <div className="flex-1">

            {/* Name Row */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <label className="font-medium">Name</label>
            </div>
            <p className="mt-1 mb-4 px-3 py-2 border border-base-300 rounded bg-base-100">
              {authUser?.fullName}
            </p>

            {/* Email Row */}
            <div className="flex items-center gap-2">
              <MailIcon className="w-4 h-4" />
              <label className="font-medium">Email</label>
            </div>
            <p className="mt-1 px-3 py-2 border border-base-300 rounded bg-base-100">
              {authUser?.email}
            </p>

          </div>
        </div>
      </div>

      {/* Account Information Section */}
      <h3 className="text-xl font-semibold mt-8 mb-3 text-base-content">Account Information</h3>

      <div className="md:w-[360px] divide-y divide-base-300 border rounded border-base-300 bg-base-100">
        <div className="flex justify-between p-3">
          <span className="font-medium">Member Since:</span>
          <span>Jan 12, 2024</span>
        </div>

        <div className="flex justify-between p-3">
          <span className="font-medium">Account Status:</span>
          <span className="font-semibold text-success">Active</span>
        </div>
      </div>

    </div>
  </div>
  )
}

export default ProfilePage
