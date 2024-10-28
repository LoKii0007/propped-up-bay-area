import React, { useState } from "react";
import ActionsDropdown from "../ui/ActionsDropdown";
import ChangeStatusModal from "../ui/ChangeStatusModal";

function OrderInfo({ order }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isAdmin = false;

  console.log("order", order);

  return (
    <>
      <div className="bg-white w-full h-full px-[5%] flex flex-col overflow-y-auto">
        <div className="flex justify-between mb-8 w-full">
          <button className="text-[#718096] border px-4 py-2 rounded-lg hover:bg-gray-100">
            User Details
          </button>
          <div className="flex space-x-4">
            {isAdmin && (
              <button
                onClick={() => setModalOpen(true)}
                className="text-[#718096] border-[#34CAA5] border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Change Status
              </button>
            )}
          </div>
        </div>

        <div className="px-12 mx-auto w-8/12">
          <h2 className="text-2xl w-full text-center font-semibold mb-6">
            {order.type} Details
          </h2>
          <div className="flex flex-col gap-x-10 gap-y-3">
            <p className="text-md grid grid-cols-2">
              <span>First Name:</span> {order.firstName}
            </p>
            <p className="text-md grid grid-cols-2">
              <span>Last Name:</span> {order.lastName}
            </p>
            <p className="text-md grid grid-cols-2">
              <span>Email:</span> {order.email}
            </p>

            {order.type === "postOrder" && (
              <>
                <p className="text-md grid grid-cols-2">
                  <span>Phone Number:</span> {order.phone}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Requested Date:</span> {order.requestedDate}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Listing Address:</span> {`${order.listingAddress.streetAddress}, ${order.listingAddress.city}, ${order.listingAddress.state} ${order.listingAddress.postalCode}`}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Billing Address:</span> {`${order.billingAddress.streetAddress}, ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postalCode}`}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Zone:</span> {order.requiredZone.name} ({order.requiredZone.text})
                </p>
                
                {order.postColor && (
                  <p className="text-md grid grid-cols-2">
                    <span>Post Color:</span> {order.postColor}
                  </p>
                )}
                {order.flyerBox && (
                  <p className="text-md grid grid-cols-2">
                    <span>Flyer Box:</span> Yes
                  </p>
                )}
                {order.lighting && (
                  <p className="text-md grid grid-cols-2">
                    <span>Lighting:</span> Yes
                  </p>
                )}
                {order.numberOfPosts > 0 && (
                  <p className="text-md grid grid-cols-2">
                    <span>Number of Posts:</span> {order.numberOfPosts}
                  </p>
                )}
                
                <p className="text-md grid grid-cols-2">
                  <span>Status:</span> {order.status}
                </p>

                <div className="text-md grid grid-cols-2">
                  <span>Riders:</span>
                  <div>
                    {Object.entries(order.riders).map(([rider, count]) =>
                      count > 0 ? (
                        <p key={rider}>
                          {rider.charAt(0).toUpperCase() + rider.slice(1)}: {count}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>
                
                {order.additionalInstructions && (
                  <p className="text-md grid grid-cols-2">
                    <span>Additional Instructions:</span> {order.additionalInstructions}
                  </p>
                )}
                <p className="text-md grid grid-cols-2">
                  <span>Total:</span> ${order.total}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <ChangeStatusModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
}

export default OrderInfo;
