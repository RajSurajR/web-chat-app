import React, { useEffect } from 'react'

import {Routes, Route, Navigate} from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore';
import { useAuth } from "@clerk/clerk-react";
import ConnectionPage from './pages/ConnectionPage';
import { useChatStore } from './store/useChatStore';

function App() {

  const { user, isLoaded, isSignedIn } = useAuth();
  const { checkAuth, authUser, isCheckingAuth,  connectSocket, disconnectSocket } = useAuthStore();
  const {subscribeToMessage, unsubscribeFromMessage} = useChatStore();
  const {theme} = useThemeStore();

  useEffect(() => {
    if (!isLoaded) return; // wait clerk to initialize
    if (isSignedIn) { // check backend when signeIn
      checkAuth();
    }
  }, [isLoaded, isSignedIn]);

    
  useEffect(() => {
    if (!authUser) return;
    // console.log("socket connect and disconnect");
  
      document.title = `${authUser?.fullName} | Reatime Chat`;
      connectSocket();
      subscribeToMessage();
      
    return () => {
      unsubscribeFromMessage();
      disconnectSocket();
    };
  }, [authUser])
  

  if((isCheckingAuth && !authUser) || !isLoaded){ // when auth are true and no authUser true run this.
    return (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
        </div>
      )
  } 

  if (isSignedIn && !authUser && !isCheckingAuth) { // if signed and backend not load authUser
     return (
       <div className="flex flex-col items-center justify-center h-screen gap-4">
         <p className="text-xl font-bold">Server Connection Failed</p>
         <p className='text-error text-lg'>Internal server issue.</p>
         <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
         >
            Retry Connection
         </button>
       </div>
     )
  }

  return (
    <div data-theme={theme}>

      <Navbar className='fixed  z-10'/>
      <Routes>
        <Route 
          path="/" 
          element={isSignedIn ? <HomePage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/profile" 
          element={isSignedIn ? <ProfilePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/connections" 
          element={isSignedIn ? <ConnectionPage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/login/*" 
          element={!isSignedIn ? <LoginPage /> : <Navigate to="/" />} 
        />

        <Route 
          path="/signup/*" 
          element={!isSignedIn ? <SignUpPage /> : <Navigate to="/" />} 
        />

        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
