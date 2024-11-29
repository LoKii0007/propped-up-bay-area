import React, { useState } from "react";
import OpenHouseForm from "../forms/openHouseForm";
import PostOrder from "../forms/postOrder"

function Order() {
  const [activeForm, setActiveForm] = useState('openHouseForm');

  return (
    <>
      <div className="order flex flex-col rounded-md gap-2 py-5">
        <div className="order-top grid grid-cols-2 mx-10 px-2 sticky top-[-13px] md:static md:top-0 ">
          <button
            onClick={() => setActiveForm("openHouseForm")}
            className={` ${
              activeForm === "openHouseForm" ? "bg-[#638856] text-white " : 'text-[#A1A1A1] bg-[#D9D9D9] '
            } py-6 rounded-l-lg text-2xl font-bold `}
          >
            Open House Order
          </button>
          <button
            onClick={() => setActiveForm("postOrder")}
            className={` ${
              activeForm === "postOrder" ? "bg-[#638856] text-white" : 'text-[#A1A1A1] bg-[#D9D9D9]'
            } py-6 rounded-r-lg text-2xl font-bold`}
          >
            Post Order
          </button>
        </div>
        <div className="order-bottom pb-[80px] md:pb-0 ">
          {activeForm === "openHouseForm" && <OpenHouseForm />}
          {activeForm === "postOrder" && <PostOrder />}
        </div>
      </div>
    </>
  );
}

export default Order;
