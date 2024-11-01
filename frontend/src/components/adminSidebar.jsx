import React, { useState } from "react";
import SignOutModal from "../ui/signOutModal";
import { UseGlobal } from "../context/GlobalContext";

const AdminSidebar = ({ setActiveView, activeView }) => {

  const menu = [
    {
      name: 'Dashboard',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
    },
    {
      name: 'Clients',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
    },
    {
      name: 'Order Requests',
      img: '/order-delivery.png',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-table-of-contents"><path d="M16 12H3"/><path d="M16 18H3"/><path d="M16 6H3"/><path d="M21 12h.01"/><path d="M21 18h.01"/><path d="M21 6h.01"/></svg>
    },
    {
      name: 'Subscription',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>
    },
    {
      name: 'Sales Report',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
    },
    {
      name: 'Invoices',
      img: '/bill.png',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
    },
    {
      name: 'Settings',
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
      </svg>
    }
  ]

  const [modalOpen, setModalOpen] = useState(false)
  const {setBreadCrumb, isInfo, setIsInfo, breadCrumb} = UseGlobal()

  function handleView(data){
    let view = data.name.toLowerCase()
    setActiveView(view)
    if(breadCrumb !== view) setBreadCrumb(data.name)
    if(isInfo) setIsInfo(false)
  }

  return (
    <>
      <div className="admin-board w-full flex flex-col py-1 items-center justify-between h-full gap-2 ">

        <div className="adminSidebar-top w-full">

          <div className="logo flex items-center gap-2 py-10 w-full justify-center">
            <img src="/logo.png" alt="logo" />
            <p className="text-[20px] font-bold">Admin</p>
          </div>

          {menu?.slice(0, 6).map((data, index) => (
            <button key={index} onClick={() => handleView(data) } className={` ${activeView === data.name.toLowerCase() ? 'bg-[#34CAA5] stroke-[#4C9A2A] text-white font-semibold' : 'text-[#737791] font-medium'} text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}>
              <div className="icon stroke-none ">
                {data.svg}
              </div>
              {data.name}
            </button>
          ))}
        </div>

        <div className="adminSidebar-bottom w-full pb-6">
          {menu?.slice(6, menu.length).map((data, index) => (
            <button key={index} onClick={() => handleView(data)} className={` ${activeView === data.name.toLowerCase() ? 'bg-[#34CAA5] stroke-[#4C9A2A] text-white font-semibold' : 'text-[#737791] font-medium'} text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}>
              
              <div className={` stroke-none icon`}>
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

export default AdminSidebar
