import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './App.css'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/navbar'
import Home from './screens/home'
import Admin from "./screens/admin"
import Register from "./auth/register"
import Login from "./auth/login";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";

function App() {

  const location = window.location
  console.log(location)

  return (
    <>
      <AuthProvider>
        {/* <Router> */}
          {location.pathname !== '/signup' && location.pathname !== '/login' && location.pathname !== '/admin' && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Toaster />
        {/* </Router> */}
      </AuthProvider>
    </>
  )
}

export default App
