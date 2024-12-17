import React, { useEffect, useState } from "react";
import { parseDate } from "../helpers/utilities";
import { useGlobal } from "../context/GlobalContext";
import OrderInfo from "./OrderInfo";

function PostRemoval({ postOrders, setPostOrders, setOrders }) {
  const { setBreadCrumb, isInfo, setIsInfo } = useGlobal();
  const [completeOrder, setCompleteOrder] = useState("");
  const [loading, setLoading] = useState(true);

  //? --------------------
  //? user click
  //?---------------------
  function handleUserClick(index) {
    const slectedOrder = postOrders[index];
    if (slectedOrder) {
      setCompleteOrder(postOrders[index]);
      setBreadCrumb("Order details"); //updating breadcrumb
      setIsInfo(true); //changing view
    }
  }

  useEffect(() => {
    setLoading(false);
  }, [postOrders]);

  useEffect(() => {}, [completeOrder]);

  return (
    <>
      {!isInfo ? (
        <div className="post-removal h-full bg-white gap-3 flex flex-col space-y-6 overflow-y-auto ">
          <div className="removal-head w-full text-xl font-semibold text-center capitalize ">
            Manage your renewals 
          </div>
          <div className="removal-body flex flex-col justify-center w-full ">
            <div className="grid grid-cols-3 md:grid-cols-6 text-[#718096] py-3 px-5 md:p-5 gap-2 w-full">
              <div className="" >Name</div>
              <div className="" >Order No.</div>
              <div className="hidden md:block" >Email</div>
              <div className="hidden md:block" >Total</div>
              <div className="hidden md:block" >Order date</div>
              <div className="" >Status</div>
            </div>
            {postOrders.length > 0 ? (
              postOrders.map((order, index) => (
                <>
                  <button
                    onClick={() => handleUserClick(index)}
                    key={order._id}
                    className="removal grid grid-cols-3 md:grid-cols-6 py-3 px-5 md:p-5 gap-2 w-full text-left hover:bg-green-100 rounded-md custom-transition"
                  >
                    
                    <div className="overflow-hidden flex gap-1">
                      {order.firstName}<span className="hidden md:block">{order.lastName}</span>
                    </div>
                    <div className="overflow-hidden">{order.orderNo}</div>
                    <div className="overflow-hidden hidden md:block">{order.email}</div>
                    <div className="overflow-hidden hidden md:block">{order.total}</div>
                    <div className="overflow-hidden hidden md:block">
                      {parseDate(order.createdAt)}
                    </div>
                    <div className="overflow-hidden">
                      {order.subActive ? (
                        <span className="text-green-800">Active</span>
                      ) : (
                        <span className="text-red-800">Cancelled</span>
                      )}
                    </div>
                  </button>
                </>
              ))
            ) : (
              <div className="text-center py-12">
                {loading
                  ? "loading..."
                  : "You don't have any active subscriptions"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <OrderInfo
          order={completeOrder}
          setOrders={setOrders}
          setPostOrders={setPostOrders}
        />
      )}
    </>
  );
}

export default PostRemoval;
