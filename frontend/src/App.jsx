import { Route, Routes, useLocation } from "react-router-dom";
import './App.css'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/navbar'
import Home from './screens/home'
import Admin from "./screens/admin"
import Register from "./auth/register"
import Login from "./auth/login";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import InvoiceDownload from "./screens/invoiceDownload";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GlobalContextProvider } from "./context/GlobalContext";

function App() {

  const location = useLocation()

  useEffect(() => {
    console.log(location.pathname)
  }, [location])

  const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
  console.log('GOOGLE_OAUTH_CLIENT_ID', GOOGLE_OAUTH_CLIENT_ID)

  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID} >
        <AuthProvider>
          <GlobalContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/invoiceDownload" element={<InvoiceDownload />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            <Toaster />
          </GlobalContextProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
