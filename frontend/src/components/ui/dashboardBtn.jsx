import React from "react";

function DashboardBtn({orderType, handleOrderType, filter, text}) {
  return (
    <>
      <div
        onClick={() => handleOrderType(filter)}
        className={` ${
          orderType === filter && "active-order"
        } text-center  px-5 cursor-pointer py-4 hover:bg-gray-100 transition .7s ease-in`}
      >
        {text}
      </div>
    </>
  );
}

export default DashboardBtn;
