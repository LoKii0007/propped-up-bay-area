import React from "react";

const AdminSidebar = ({ setActiveView, activeView }) => {

  const menu = [
    {
      name: 'Clients',
      img: '/clients.png'
    },
    {
      name: 'Order Requests',
      img: '/order-delivery.png'
    },
    {
      name: 'Subscription',
      img: '/subscribe.png'
    },
    {
      name: 'Sales Report',
      img: '/report.png'
    },
    {
      name: 'Invoices',
      img: '/bill.png'
    },
    {
      name: 'Messages',
      img: '/message.png'
    },
    {
      name: 'Settings',
      img: '/settings.png'
    },
    {
      name: 'sign Out',
      img: '/logout.png'
    },
  ]

  return (
    <>
      <div className="admin-board flex flex-col py-1 items-center justify-between h-full gap-2 ">

        <div className="adminSidebar-top">

          <div className="logo flex items-center gap-2 py-10 w-full justify-center">
            <img src="/logo.png" alt="logo" />
            <p className="text-[20px] font-bold">Admin</p>
          </div>

          {menu?.slice(0, 5).map((data, index) => (
            <button key={index} onClick={() => setActiveView(data.name.toLowerCase())} className={` ${activeView === data.name.toLowerCase() ? 'bg-[#4C9A2A] text-white font-semibold' : 'text-[#737791] font-medium'} text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}>
              <img className="menu-icon w-4 h-4 " src={data.img} ></img>
              {data.name}
            </button>
          ))}
        </div>

        <div className="adminSidebar-bottom">
          {menu?.slice(5, 9).map((data, index) => (
            <button key={index} onClick={() => setActiveView(data.name.toLowerCase())} className={` ${activeView === data.name.toLowerCase() ? 'bg-[#4C9A2A] text-white font-semibold' : 'text-[#737791] font-medium'} text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}>
              <img className="menu-icon w-4 h-4 " src={data.img} ></img>
              {data.name}
            </button>
          ))}
        </div>

      </div>
    </>
  );
};

export default AdminSidebar
