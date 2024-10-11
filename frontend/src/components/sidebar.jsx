import React from "react";
import Dropdown from "../ui/dropdown";

const Sidebar = ({ setActiveView, activeView }) => {

  const menu = [
    {
      name: 'Dashboard',
      img: '/monitor.png'
    },
    {
      name: 'Order',
      img: '/plus.png'
    },
    {
      name: 'Removal',
      img: '/trash.png'
    },
    // {name : 'Visit', 
    //   img:'/location-mark.png'
    // },
    // {name : 'History', 
    //   img:'/history.png'
    // },
    {
      name: 'Profile',
      img: '/user.png'
    },
    {
      name: 'Payment Info',
      img: '/credit-card.png'
    },
  ]

  return (
    <>
      <div className="admin-board flex flex-col py-1 items-center justify-between h-full gap-2 ">

        <div className="sidebar-top">

          <div className="logo flex items-center gap-2 py-10 w-full justify-center">
            <img src="/logo.png" alt="logo" />
            <p className="text-[20px] font-bold">Propped Up</p>
          </div>

          {menu?.slice(0, 3).map((data, index) => (
            <button key={index} onClick={() => setActiveView(data.name.toLowerCase())} className={` ${activeView === data.name.toLowerCase() ? 'bg-[#4C9A2A] text-white font-semibold' : 'text-[#737791] font-medium'} text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}>
              <img className="menu-icon w-4 h-4 " src={data.img} ></img>
              {data.name}
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          {menu?.slice(3, menu.length).map((data, index) => (
            <button key={index} onClick={() => setActiveView(data.name.toLowerCase())} className={` ${activeView === data.name.toLowerCase() ? 'bg-[#4C9A2A] text-white font-semibold' : 'text-[#737791] font-medium'} text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}>
              <img className="menu-icon w-4 h-4 " src={data.img} ></img>
              {data.name}
            </button>
          ))}
          <button className={`text-[#737791] font-medium'} text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`} >Sign out </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
