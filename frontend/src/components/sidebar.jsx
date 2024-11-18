import React, {useState} from "react"
import SignOutModal from "../ui/signOutModal"
import { UseGlobal } from "../context/GlobalContext"
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActiveView, activeView }) => {
  const menu = [
    {
      name: "Dashboard",
      svg : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table-of-contents"><path d="M16 12H3"/><path d="M16 18H3"/><path d="M16 6H3"/><path d="M21 12h.01"/><path d="M21 18h.01"/><path d="M21 6h.01"/></svg>
    },
    {
      name: "Order",
      svg : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
    },
    {
      name: "Removal",
      svg : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw-off"><path d="M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47"/><path d="M8 16H3v5"/><path d="M3 12C3 9.51 4 7.26 5.64 5.64"/><path d="m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64"/><path d="M21 12c0 1-.16 1.97-.47 2.87"/><path d="M21 3v5h-5"/><path d="M22 22 2 2"/></svg>
    },
    {
      name: "Profile",
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
    },
    // {
    //   name: "Payment Info",
    //   svg : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
    // },
  ]

  const [modalOpen, setModalOpen] = useState(false)
  const {setBreadCrumb, isInfo, setIsInfo, breadCrumb} = UseGlobal()
  const navigate = useNavigate()

  function handleView(data){
    let view = data.toLowerCase()
    setActiveView(view)
    if(breadCrumb !== view) setBreadCrumb(data)
    if(isInfo) setIsInfo(false)
  }

  return (
    <>
      <div className="admin-board w-full flex flex-col py-1 items-center justify-between h-full gap-2 ">
        <div className="sidebar-top w-full ">
          <div onClick={()=>handleView('dashboard')} className="logo flex items-center hover:cursor-pointer gap-2 py-10 w-full justify-center">
            <img src="/logo.png" alt="logo" />
            <p className="text-[20px] font-bold">Propped Up</p>
          </div>

          {menu?.slice(0, 3).map((data, index) => (
            <button
              key={index}
              onClick={() => handleView(data.name)}
              className={` ${
                activeView === data.name.toLowerCase()
                  ? "bg-[#638856] text-white font-semibold"
                  : "text-[#737791] font-medium"
              } text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}
            >
              <div className="icon">
                {data.svg}
              </div>
              {data.name}
            </button>
          ))}
        </div>

        <div className="sidebar-bottom pb-6 w-full ">
          {menu?.slice(3, menu.length).map((data, index) => (
            <button
              key={index}
              onClick={() => handleView(data.name)}
              className={` ${
                activeView === data.name.toLowerCase()
                  ? "bg-[#638856] text-white font-semibold"
                  : "text-[#737791] font-medium"
              } text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}
            >
              <div className="icon">
                {data.svg}
              </div>
              {data.name}
            </button>
          ))}
          <button onClick={() => setModalOpen(true) } className={`text-[#737791] font-medium text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}>
            <div className={` stroke-none icon`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
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
