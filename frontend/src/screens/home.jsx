import React, { useContext, useState } from "react";
import "../css/home.css"
import Dashboard from "../components/dashboard";
import Sidebar from "../components/sidebar"
import Order from "../components/order";
import PostRemoval from "../forms/postRemoval";
import Profile from "../components/profile"
import CardDetails from "../components/cardDetails"
import axios from 'axios'
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [activeView, setActiveView] = useState("dashboard")
  const {currentUser} = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/postOrder/create-checkout-session');
      window.location.href = res.data.url;
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }


  return (
    <>
      <div className="home w-[100vw] flex h-screen ">
        <div className="sidebar min-w-[300px] w-2/12 px-10 flex flex-col justify-between gap-5 bg-white ">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        <div className="active-content w-full overflow-y-auto h-full ">

          <div className="active-top bg-[#F4FFF0] w-full flex px-12 py-10 justify-between items-center sticky top-0 ">
            <div className="home-left font-bold text-3xl ">Home</div>
            <div className="home-right">welcome { currentUser ? currentUser?.email : 'Guest'}</div>
          </div>
          <div className="active-bottom h-full">
            {activeView === "dashboard" && <Dashboard />}
            {activeView === "order" && <Order />}
            {activeView === "removal" && <PostRemoval />}
            {activeView === "profile" && <Profile />}
            {activeView === "payment info" && <CardDetails />}
          </div>

        </div>
      </div>

      {/* <form onSubmit={handleSubmit} >

      <input type="hidden" name="priceId" value="price_G0FvDp6vZvdwRZ" />
      <button type="submit">Checkout</button>
    </form> */}

    </>
  );

};

export default Home
