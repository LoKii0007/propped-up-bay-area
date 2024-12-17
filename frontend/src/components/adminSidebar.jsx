import React, { useState } from "react";
import SignOutModal from "../ui/signOutModal";
import { useGlobal } from "../context/GlobalContext";

const AdminSidebar = ({ setActiveView, activeView }) => {
  const menu = [
    {
      name: "Dashboard",
      svg: '/svg/dashboard.svg'
    },
    {
      name: "Order Requests",
      svg: '/svg/orders.svg'
    },
    {
      name: "Clients",
      svg: '/svg/clients.svg'
    },
    {
      name: "Renewals",
      svg: '/svg/subscriptions.svg'
    },
    {
      name: "Edit Pricing",
      svg: '/svg/dollar.svg'
    },
    {
      name: "Invoices",
      svg: '/svg/invoices.svg'
    },
    {
      name: "Settings",
      svg: '/svg/settings.svg'
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const { setBreadCrumb, isInfo, setIsInfo, breadCrumb } = useGlobal();

  function handleView(data) {
    let view = data.name.toLowerCase();
    setActiveView(view);
    if (breadCrumb !== view) setBreadCrumb(data.name);
    if (isInfo) setIsInfo(false);
  }

  function handleAdminBtn() {
    setActiveView("order requests");
    if (isInfo) setIsInfo(false);
  }

  return (
    <>
      <div className="admin-board w-full flex flex-col py-1 items-center justify-between h-full gap-2 ">
        <div className="adminSidebar-top w-full">
          <div className="logo flex items-center gap-2 py-10 w-full justify-center">
            <button onClick={() => handleAdminBtn()} className="flex gap-2 px-4">
              <img src="/logo.png" alt="logo" />
              <p className="text-[20px] font-bold">Admin</p>
            </button>
          </div>

          {menu?.slice(1, 6).map((data, index) => (
            <button
              key={index}
              onClick={() => handleView(data)}
              className={` ${
                activeView === data.name.toLowerCase()
                  ? "bg-[#34CAA5] stroke-[#4C9A2A] text-white font-semibold"
                  : "text-[#737791] font-medium"
              } text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}
            >
              <img className="icon stroke-none " src={data.svg} alt={data.name} />
              {data.name}
            </button>
          ))}
        </div>

        <div className="adminSidebar-bottom w-full pb-6">
          {menu?.slice(menu.length - 1, menu.length).map((data, index) => (
            <button
              key={index}
              onClick={() => handleView(data)}
              className={` ${
                activeView === data.name.toLowerCase()
                  ? "bg-[#34CAA5] stroke-[#4C9A2A] text-white font-semibold"
                  : "text-[#737791] font-medium"
              } text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}
            >
              <img className="icon stroke-none " src={data.svg} alt={data.name} />
              {data.name}
            </button>
          ))}

          <button
            onClick={() => setModalOpen(true)}
            className={`text-[#737791] font-medium text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}
          >
            <img className="icon stroke-none " src="/svg/signout.svg" alt="signout" />
            Sign out
          </button>
        </div>
      </div>

      {/* --------------------------------moadl-------------------------  */}
      <SignOutModal
        setOpen={setModalOpen}
        open={modalOpen}
        text={"You want to sign out?"}
        btnText={"Sign out"}
      />
    </>
  );
};

export default AdminSidebar;
