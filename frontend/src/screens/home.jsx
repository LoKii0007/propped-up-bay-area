import React, { useState } from "react";
import "../css/home.css"
import Dashboard from "../components/dashboard";
import Sidebar from "../components/sidebar"
import Order from "../components/order";
import PostRemoval from "../components/forms/postRemoval";
import Profile from "../components/profile";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  const [activeView, setActiveView] = useState("dashboard")

  return (
    <>
      <div className="home w-[100vw] bg-gray-200 h-[92vh] flex">
        <div className="sidebar w-[15vw] flex flex-col justify-between mt-5 gap-5 bg-white shadow-md rounded-lg ">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
        </div>
        {/* <div className="h-full bg-white w-[2px]"></div> */}
        <div className="active-content mt-5 w-full">
          {activeView === "dashboard" && <Dashboard />}
          {activeView === "order" && <Order/>}
          {activeView === "removal" && <PostRemoval/>}
          {activeView === "profile" && <Profile/>}
        </div>
      </div>

      {/* <div className="lottie">
         <DotLottieReact loop autoplay  src="/hamster.json" />
      </div> */}
    </>
  );
  
};

export default Home
