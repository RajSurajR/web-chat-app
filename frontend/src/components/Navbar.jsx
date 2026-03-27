import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, MessageSquareQuote, Settings, User, UserPlus2 } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SignInButton, useAuth, useClerk, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const {logout, authUser} = useAuthStore();
  const handleLogout = async() =>{
    logout({signOut, navigate});
  }

  return (
   <header className="fixed top-0  z-10 w-full shadow-md px-6 py-1 flex items-center justify-between bg-base-100 text-base-content">

    {/* Left side (Logo + App name) */}
    <Link to="/" className="flex items-center justify-center cursor-pointer">
      <div className="w-12 h-12">
        <MessageSquareQuote className="w-8 h-8 mt-2.5 text-primary" />
      </div>
      <h1 className="text-xl font-semibold text-primary">Chatio</h1>
    </Link>

    {/* Right side (User Profile + Logout) */}
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <>
           <UserButton />
        </>
      ) : (
        <SignInButton />
      )}

      <Link to="/settings" className="flex items-center gap-1  transition">
        <Settings className="w-5 h-5" />
        <span className="hidden sm:inline">Settings</span>
      </Link>

      {authUser && (
        <>
          <Link to="/connections" className="flex items-center gap-1  transition px-2 border-x-2 border-base-300">
            <UserPlus2 className="w-5 h-5" />
            <span className="hidden sm:inline">Connection</span>
          </Link>

          <Link to="/profile" className="flex items-center gap-1  transition">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-error btn-sm text-error-content px-4 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </>
      )}

    </div>

  </header>

  )
}

export default Navbar
