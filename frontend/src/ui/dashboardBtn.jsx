import React from "react";

function DashboardBtn({orderType, handleOrderType, filter, text}) {
  return (
    <>
      <button
        onClick={() => handleOrderType(filter)}
        className={` ${
          orderType === filter ? "bg-[#444242] text-white" : 'bg-gray-100'
        } text-center rounded-[4px] p-2 dashboard-btn`}
      >
        {text}
      </button>
    </>
  );
}

export default DashboardBtn;
