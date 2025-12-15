import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, MailIcon, MessageSquareQuote } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(
    { email:"", password:"",}
  );

  const {login, isLoggingIng} = useAuthStore();

  const validateForm = () =>{
      if(!formData.email.trim()) return toast.error("Email is required");
      if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email");
      if(!formData.password) return toast.error("Password is required");

      return true;
  };
  const handleSubmit = (e) =>{
    e.preventDefault();
    const valid = validateForm();
    if(valid==true){
      login(formData);
    }
    
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-50">
    
      {/* Left Side (Form) */}
      <div className="w-full md:w-1/2 md:pt-0 pt-20 flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 text-indigo-600 text-2xl font-semibold">
          <MessageSquareQuote className="w-8 h-8" />
          <span>Chat App</span>
        </div>

        {/* Sign Up Form */}
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Login Account</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          

            {/* Email */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <MailIcon className="w-5 h-5 text-gray-500" />
              <input
                type="email"
                className="w-full outline-none text-gray-700"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e)=> setFormData({...formData, email:e.target.value})}
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Lock className="w-5 h-5 text-gray-500" />
              <input
                type={showPassword?"text":"password"}
                className="w-full outline-none text-gray-700"
                placeholder="password"
                value={formData.password}
                onChange={(e)=>setFormData({...formData, password:e.target.value})}
              />
              <button 
                type='button'
                className='flex items-center'
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword? 
                (<EyeOff className="w-5 h-5 text-gray-700"/>) : 
                (<Eye className="w-5 h-5 text-gray-700"/>)}
              </button>
            </div>

            {/* Button */}
            <button type="submit"
              className="text-center w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              disabled={isLoggingIng}
            >{isLoggingIng?
            (
              <div className="flex justify-center items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </div>
              )
              :("Login")}</button>
          </form>

          {/* Alread have account */}
          <div className='text-center mt-5'>
              <p className='text-base text-gray-700'>
                Not have an account?{" "}
                <Link to="/signup" className="text-indigo-800">
                Sign up 
                </Link>
              </p>
          </div>
        </div>
      </div>

      {/* Right Side Image */}
      {/* <AuthImagePattern
        title="Join our community"
        subtitle="Talk with friends, share moments, ans stay Connected"
      /> */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-indigo-200">
        {/* <p className='text-2xl justify-center items-center'>Join Our community</p> */}
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
          alt="signup"
          className="w-full h-full object-cover"
        />
      </div>

    </div>


  );
}

export default LoginPage
