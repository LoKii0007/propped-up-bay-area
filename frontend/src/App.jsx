import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar';
import Home from './screens/home';
import Admin from "./screens/admin";
import OpenHouseForm from "./components/forms/openHouseForm";
import SignUp from "./screens/signUp";
import AdminDashboard from "./components/clientDetails";

function App() {


  return (
    <>
      {/* <GlobalContextProvider> */}
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/admin" element={<Admin />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/login" element={<OpenHouseForm />} />
        </Routes>
        <Toaster />
      </Router>
      {/* </GlobalContextProvider> */}
    </>
  )
}

export default App
