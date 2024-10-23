import React from "react";

function DashboardBtn({orderType, handleOrderType, filter, text}) {
  return (
    <>
      <button
        onClick={() => handleOrderType(filter)}
        className={` ${
          orderType === filter ? "bg-[#638856] text-white" : 'bg-gray-100'
        } text-center rounded-xl text-xl p-2 py-3 mx-4 dashboard-btn`}
      >
        {text}
      </button>
    </>
  );
}

export default DashboardBtn;
