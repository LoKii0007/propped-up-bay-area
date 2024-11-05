import React, { useEffect, useState } from "react";
import ActionsDropdown from "../ui/ActionsDropdown";
import ChangeStatusModal from "../ui/ChangeStatusModal";
import { useAuth } from "../context/AuthContext";
import CancelSubModal from "../ui/CancelSubModal";
import { parseDate } from "../helpers/utilities";

function OrderInfo({ order, setPostOrders , setOrders, setCompleteOrder }) {
  const [modalOpen, setModalOpen] = useState(false);
  const {admin } = useAuth();

  useEffect(()=>{
  }, [order, setOrders, setPostOrders])

  return (
    <>
      <div className="bg-white w-full h-full px-[5%] flex flex-col overflow-y-auto">
        <div className="flex justify-end mb-8 w-full">
          {/* <button className="text-[#718096] border px-4 py-2 rounded-lg hover:bg-gray-100">
            User Details
          </button> */}
          <div className="flex space-x-4">
            {["admin", "superuser"].includes(admin?.role) && (
              <button
                onClick={() => setModalOpen(true)}
                className="text-[#718096] border-[#34CAA5] border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Change Status
              </button>
            )}
            {!admin && order?.type === 'postOrder' && order?.subActive === true &&
              <>
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel subscription
                </button>
              </>
            }
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

            {order.type === "openHouse" && (
              <>
                <p className="text-md grid grid-cols-2">
                  <span>Status:</span> {order.status}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">Phone Number:</span> {order.phone}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">First Event Date:</span>{" "}
                  {parseDate(order.requestedDate)}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">First Event Start Time:</span>{" "}
                  {order.firstEventStartTime}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">First Event End Time:</span>{" "}
                  {order.firstEventEndTime}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">Event Address:</span>{" "}
                  {`${order.firstEventAddress.streetAddress}, ${order.firstEventAddress.city}, ${order.firstEventAddress.state} ${order.firstEventAddress.postalCode}`}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">Zone:</span> {order.requiredZone.name} (
                  {order.requiredZone.text})
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">Additional Signs:</span>{" "}
                  {order.additionalSignQuantity}
                </p>
                {order.twilightTourSlot && (
                  <p className="text-md grid grid-cols-2">
                    <span className="">Twilight Tour Slot:</span>{" "}
                    {order.twilightTourSlot}
                  </p>
                )}
                {order.printAddressSign && (
                  <>
                    <p className="text-md grid grid-cols-2">
                      <span className="">Print Address Sign:</span> Yes
                    </p>
                    <p className="text-md grid grid-cols-2">
                      <span className="">Print Address:</span>{" "}
                      {`{order.printAddress.streetAddress}, ${order.printAddress.city}, ${order.printAddress.state} ${order.printAddress.postalCode}`}
                    </p>
                  </>
                )}
                {order.additionalInstructions && (
                  <p className="text-md grid grid-cols-2">
                    <span className="">Additional Instructions:</span>{" "}
                    {order.additionalInstructions}
                  </p>
                )}
                <p className="text-md grid grid-cols-2">
                  <span className="">Total:</span> ${order.total}
                </p>
              </>
            )}

            {order.type === "postOrder" && (
              <>
                <p className="text-md grid grid-cols-2">
                  <span>Phone Number:</span> {order.phone}
                </p>
                <p className="text-md grid grid-cols-2 font-semibold ">
                  <span>Subscription :</span>  {order.subActive ? <span className="text-green-800" >Active</span> : <span className="text-red-800" >Cancelled</span> }
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Requested Date:</span> {parseDate(order.requestedDate)}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Listing Address:</span>{" "}
                  {`${order.listingAddress.streetAddress}, ${order.listingAddress.city}, ${order.listingAddress.state} ${order.listingAddress.postalCode}`}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Billing Address:</span>{" "}
                  {`${order.billingAddress.streetAddress}, ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postalCode}`}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Zone:</span> {order.requiredZone.name} (
                  {order.requiredZone.text})
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
                          {rider.charAt(0).toUpperCase() + rider.slice(1)}:{" "}
                          {count}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>

                {order.additionalInstructions && (
                  <p className="text-md grid grid-cols-2">
                    <span>Additional Instructions:</span>{" "}
                    {order.additionalInstructions}
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

      {/* -------------------------modals ---------------- */}
      {admin?.role === "admin" ? (
        <ChangeStatusModal setCompleteOrder={setCompleteOrder} order={order} open={modalOpen} setOpen={setModalOpen} setOrders={setOrders} setFilteredOrders={setFilteredOrders} />
      ) : (
        <CancelSubModal
          setPostOrders={setPostOrders}
          setOrders={setOrders}
          orderId={order._id}
          sessionId={order.sessionId}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}
    </>
  );
}

export default OrderInfo;
