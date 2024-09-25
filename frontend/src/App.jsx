import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar';
import Home from './screens/home';
import Admin from "./screens/admin";
import OpenHouseForm from "./components/forms/openHouseForm";
import Login from "./components/login";
import Register from "./components/register";
import { ToastContainer } from "react-toastify";

function App() {
  

  return (
    <>
      {/* <GlobalContextProvider> */}
        <Router>
          <Navbar/>
          <Routes>
            <Route
              exact
              path="/login"
              element={<Login/>}
            />
            <Route
              exact
              path="/register"
              element={<Register/>}
            />
            <Route
              exact
              path="/"
              element={<Home/>}
            ></Route>
            <Route
              exact
              path="/admin"
              element={<Admin/>}
            ></Route>
            <Route
              exact
              path="/openHouseForm"
              element={<OpenHouseForm/>}
            ></Route>
          </Routes>
          <Toaster />
          <ToastContainer />
        </Router>
      {/* </GlobalContextProvider> */}
    </>
  )
}

export default App
