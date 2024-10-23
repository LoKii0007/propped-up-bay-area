import React, { useContext, useEffect, useState } from "react";
import "../css/home.css";
import Sidebar from "../components/sidebar";
import Order from "../components/order";
import PostRemoval from "../forms/postRemoval";
import Profile from "../components/profile";
import CardDetails from "../components/cardDetails";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import OrderRequests from "../components/orderRequests";
import { UseGlobal } from "../context/GlobalContext";
import ClieentOrders from "../components/ClientOrders";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const { currentUser } = useContext(AuthContext);
  const {breadCrumb, setBreadCrumb, isInfo, setIsInfo} = UseGlobal()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/postOrder/create-checkout-session"
      );
      window.location.href = res.data.url;
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  }

  function handleView(){
    if(isInfo) setIsInfo(false)
    if(breadCrumb !== activeView) setBreadCrumb(activeView)
  }


  useEffect(()=>{
    if(!currentUser){
      navigate('/signup')
    }
  }, [])

  return (
    <>
      <div className="home w-[100vw] flex h-screen ">
        <div className="sidebar min-w-fit w-3/12 px-10 border-r flex flex-col items-center justify-between gap-5 bg-white ">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        <div className="active-content w-full overflow-y-auto h-full ">
          <div className="active-top bg-[#638856] w-full flex max-h-[13vh] px-12 py-10 justify-between text-white items-center sticky top-0 shadow-sm ">
            <div className="text-2xl font-bold flex gap-3 items-center capitalize justify-center">
              <button onClick={handleView} className="chevron-icon px-3 py-1 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  class="bi bi-chevron-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    stroke="#fff"
                    strokeWidth={1}
                    fill-rule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                  />
                </svg>
              </button>
              {breadCrumb}
            </div>
            <div className="home-right">
              welcome {currentUser ? currentUser?.email : "Guest"}
            </div>
          </div>
          <div className="active-bottom h-[87vh] overflow-y-auto p-7">
            {activeView === "dashboard" && <ClieentOrders/> }
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

export default Home;
