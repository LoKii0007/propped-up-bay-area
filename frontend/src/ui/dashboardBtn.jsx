import React from "react";

function DashboardBtn({orderType, handleOrderType, filter, text}) {
  return (
    <>
      <button
        onClick={() => handleOrderType(filter)}
        className={` ${
          orderType === filter ? "active-order" : 'bg-[#A5CC94]'
        } text-center rounded-full px-1 py-4 dashboard-btn`}
      >
        {text}
      </button>
    </>
  );
}

export default DashboardBtn;
