import React, {useState} from "react";
import Dropdown from "../ui/dropdown";
import SignOutModal from "../ui/signOutModal";
import { UseGlobal } from "../context/GlobalContext";

const Sidebar = ({ setActiveView, activeView }) => {
  const menu = [
    {
      name: "Dashboard",
      img: "/monitor.png",
    },
    {
      name: "Order",
      img: "/plus.png",
    },
    {
      name: "Removal",
      img: "/trash.png",
    },
    {
      name: "Profile",
      img: "/user.png",
    },
    {
      name: "Payment Info",
      img: "/credit-card.png",
    },
  ]

  const [modalOpen, setModalOpen] = useState(false)
  const {setBreadCrumb, isInfo, setIsInfo, breadCrumb} = UseGlobal()

  return (
    <>
      <div className="admin-board flex flex-col py-1 items-center justify-between h-full gap-2 ">
        <div className="sidebar-top">
          <div className="logo flex items-center gap-2 py-10 w-full justify-center">
            <img src="/logo.png" alt="logo" />
            <p className="text-[20px] font-bold">Propped Up</p>
          </div>

          {menu?.slice(0, 3).map((data, index) => (
            <button
              key={index}
              onClick={() => setActiveView(data.name.toLowerCase())}
              className={` ${
                activeView === data.name.toLowerCase()
                  ? "bg-[#4C9A2A] text-white font-semibold"
                  : "text-[#737791] font-medium"
              } text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}
            >
              <img className="menu-icon w-4 h-4 " src={data.img}></img>
              {data.name}
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          {menu?.slice(3, menu.length).map((data, index) => (
            <button
              key={index}
              onClick={() => setActiveView(data.name.toLowerCase())}
              className={` ${
                activeView === data.name.toLowerCase()
                  ? "bg-[#4C9A2A] text-white font-semibold"
                  : "text-[#737791] font-medium"
              } text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}
            >
              <img className="menu-icon w-4 h-4 " src={data.img}></img>
              {data.name}
            </button>
          ))}
          <button onClick={() => setModalOpen(true) } className={`text-[#737791] font-medium text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}>
            <div className={` stroke-none icon`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
              </svg>
            </div>
            Sign out
          </button>
        </div>
      </div>

      
      {/* --------------------------------moadl-------------------------  */}
      <SignOutModal setOpen={setModalOpen} open={modalOpen} text={'You want to sign out?'} btnText={'Sign out'} />
    </>
  );
};

export default Sidebar;
