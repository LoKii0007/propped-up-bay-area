import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Order from "../components/order";
// import PostRemoval from "../forms/postRemoval";
import CardDetails from "../components/cardDetails";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { UseGlobal } from "../context/GlobalContext";
import ClieentOrders from "../components/ClientOrders";
import { useNavigate } from "react-router-dom";
import EditProfileForm from "../components/profile";
import { getOpenHouseOrder, getpostOrder } from "../api/orders";
import toast from "react-hot-toast";
import PostRemoval from "../components/PostRemoval";

const Home = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const { currentUser, setCurrentUser } = useAuth();
  const { breadCrumb, setBreadCrumb, isInfo, setIsInfo, baseUrl } = UseGlobal();
  const [orders, setOrders] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [postOrders, setPostOrders] = useState([])
  const navigate = useNavigate();

  //? ------------------------------
  //? breadcrumbs
  //? ------------------------------
  function handleView() {
    if (isInfo) setIsInfo(false);
    if (breadCrumb !== activeView) setBreadCrumb(activeView);
  }

  //? ------------------------------
  //? logging user by authtoken
  //? ------------------------------
  async function handleLogin() {
    // const res = await getUserByToken()
    // if (res.status === 200) {
    //   setCurrentUser(res.data.user);
    //   console.info("logged in");
    // }else{
    //   navigate("/login");
    // }
  }

  //? ----------------------------------
  //? loading orders
  //?  ---------------------------------
  async function handleOrders() {
    const openHouseOrderResponse = await getOpenHouseOrder()
    const postOrderResponse = await getpostOrder();
    let combinedOrders
    if(postOrderResponse.status === 200){
      combinedOrders = [...postOrderResponse.data.orders];
      setPostOrders(postOrderResponse.data.orders)
    }
    if(openHouseOrderResponse.status === 200){
      combinedOrders = [(prev)=> [...prev, ...openHouseOrderResponse.data.orders]]
    }
    setOrders(combinedOrders);
    console.log("res : ", combinedOrders);
  }


  //? ----------------------------------
  //? loading userDetails
  //?  ---------------------------------
  async function handleUserDetails() {
    try {
      const res = await axios.get(`${baseUrl}/api/get/userDetails`, { withCredentials: true })

      if (res.status === 200) {
        setUserDetails(res.data.userDetails[0])
      }
      else if (res.status === 404) {
        toast.error(res.data.message || 'user or user details not found')
      }
      else if (res.status === 400) {
        toast.error(res.data.message || 'error fetching user details')
      } else {
        console.log('error fetching user details', error.message)
      }
    } catch (error) {
      toast.error('error fetching user details.')
      console.log(error.message)
    }
  }

  useEffect(() => {
    if (!currentUser) {
      const user = JSON.parse(sessionStorage.getItem('proppedUpUser'))
      if(user){
        setCurrentUser(user)
      }else{
        navigate("/login");
      }
    }
    else if (currentUser) {
      if (!currentUser.profileCompleted) {
        navigate('/signup/details')
        return
      }
      handleOrders();
      handleUserDetails()
    }
  }, [currentUser, setCurrentUser]);

  useEffect(()=>{}, [postOrders])

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
            {activeView === "dashboard" && <ClieentOrders orders={orders} />}
            {activeView === "order" && <Order />}
            {activeView === "removal" && <PostRemoval setPostOrders={setPostOrders} postOrders={postOrders} />}
            {activeView === "profile" && <EditProfileForm userDetails={userDetails} user={currentUser} />}
            {activeView === "payment info" && <CardDetails />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
