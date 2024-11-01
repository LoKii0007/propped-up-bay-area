import { Route, Routes } from "react-router-dom";
import './App.css'
import { Toaster } from 'react-hot-toast'
import Home from './screens/home'
import Admin from "./screens/admin"
import Register from "./auth/register"
import Login from "./auth/login";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GlobalContextProvider } from "./context/GlobalContext";
import SignUpDetails from "./auth/signupDetails";

function App() {

  const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID

  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID} >
        <AuthProvider>
          <GlobalContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/signup/details" element={<SignUpDetails />} />
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
