import React, { useState } from "react";
import OpenHouseForm from "./forms/openHouseForm";
import PostOrder from "./forms/postOrder";
import PostRemoval from "./forms/postRemoval";

function Order() {
  const [activeForm, setActiveForm] = useState();

  return (
    <>
      <div className="order flex flex-col bg-white mx-5 gap-2 py-5 shadow-md rounded-lg h-full overflow-y-scroll">
        <div className="order-top grid grid-cols-2 border-b-2 mx-10 px-2">
          <button
            onClick={() => setActiveForm("openHouseForm")}
            className={` ${
              activeForm === "openHouseForm" && "active-order"
            } pt-4 pb-8 hover:bg-gray-100 ease duration-500`}
          >
            Open House Order
          </button>
          <button
            onClick={() => setActiveForm("postOrder")}
            className={` ${
              activeForm === "postOrder" && "active-order"
            } pt-4 pb-8 hover:bg-gray-100 ease duration-500`}
          >
            Post Order
          </button>
        </div>
        <div className="order-bottom">
          {activeForm === "openHouseForm" && <OpenHouseForm />}
          {activeForm === "postOrder" && <PostOrder />}
        </div>
      </div>
    </>
  );
}

export default Order;
