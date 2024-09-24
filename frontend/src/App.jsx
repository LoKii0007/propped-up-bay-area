import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar';
import Home from './screens/home';
import Admin from "./screens/admin";
import OpenHouseForm from "./components/forms/openHouseForm";

function App() {
  

  return (
    <>
      {/* <GlobalContextProvider> */}
        <Router>
          <Navbar/>
          <Routes>
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
        </Router>
      {/* </GlobalContextProvider> */}
    </>
  )
}

export default App
