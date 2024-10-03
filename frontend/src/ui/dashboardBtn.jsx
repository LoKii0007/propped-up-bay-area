import React from "react";

function DashboardBtn({orderType, handleOrderType, filter, text}) {
  return (
    <>
      <div
        onClick={() => handleOrderType(filter)}
        className={` ${
          orderType === filter ? "active-order" : 'bg-[#A5CC94]'
        } text-center rounded-full px-1 mx-5 cursor-pointer py-4 hover:bg-[#4C9A2A] transition .7s ease-in`}
      >
        {text}
      </div>
    </>
  );
}

export default DashboardBtn;
