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
import ConfirmationPage from "./screens/ConfirmationPage";
import UserInvoice from "./components/UserInvoice";
import SheetsCallback from "./components/SheetsCallback";
import ResetScreen from "./screens/ResetScreen";

function App() {

  const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID

  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID} >
        <AuthProvider>
          <GlobalContextProvider>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/admin" element={<Admin />} />
              <Route exact path="/admin/sheets/auth-callback" element={<SheetsCallback />} />
              <Route exact path="/signup" element={<Register />} />
              <Route exact path="/user/reset-pass" element={<ResetScreen />} />
              <Route exact path="/signup/details" element={<SignUpDetails />} />
              <Route exact path="/order/openHouse/payment" element={<ConfirmationPage />} />
              <Route exact path="/order/postOrder/payment" element={<ConfirmationPage />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/download/invoice/:orderId" element={<UserInvoice />} />
            </Routes>
            <Toaster />
          </GlobalContextProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
