

import React, { useEffect } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import { useAuthstore } from './store/authStore.js'
import {Loader} from "lucide-react"
import { Toaster } from "react-hot-toast";
import { useThemeStore } from './store/useThemeStore.js'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthstore()

  const {theme}=useThemeStore()

  console.log(onlineUsers)

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(!authUser && isCheckingAuth){
    return <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  }


  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser? <Home/> : <Navigate to="/signup"/>}/>
        <Route path='/signup' element={!authUser ? <Signup/>: <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <Login/>: <Navigate to="/"/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/profile' element={authUser? <Profile/>: <Navigate to="/signup"/>}/>      
      </Routes>

      <Toaster/>
      
    </div>
  )
}

export default App