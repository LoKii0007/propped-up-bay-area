import React, { useState } from "react";
import ActionsDropdown from "../ui/ActionsDropdown";
import ChangeStatusModal from "../ui/ChangeStatusModal";

function OrderInfo({ order }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isAdmin = false

  return (
    <>
      <div className="bg-white w-full h-full px-[5%] flex flex-col overflow-y-auto">
        <div className="flex justify-between mb-8 w-full">
          <button className="text-[#718096] border px-4 py-2 rounded-lg hover:bg-gray-100">
            User Details
          </button>
          <div className="flex space-x-4">
            {/* <ActionsDropdown /> */}
            { isAdmin && <button
              onClick={() => setModalOpen(true)}
              className="text-[#718096] border-[#34CAA5] border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Change Status
            </button> }
          </div>
        </div>

        <div className="px-12 mx-auto w-8/12">
          <h2 className="text-2xl w-full text-center font-semibold  mb-6">
            Open House Details
          </h2>
          <div className="flex flex-col gap-x-10 gap-y-3">
            <p className="text-md grid grid-cols-2">
              <span className="">First Name:</span> {order.firstName}
            </p>
            <p className="text-md grid grid-cols-2">
              <span className="">Last Name:</span> {order.lastName}
            </p>
            <p className="text-md grid grid-cols-2">
              <span className="">Email:</span> {order.email}
            </p>
            <p className="text-md grid grid-cols-2">
              <span className="">Phone Number:</span> {order.phone}
            </p>

            {order.type === "openHouse" && (
              <>
                <p className="text-md grid grid-cols-2">
                  <span className="">First Event Date:</span>{" "}
                  {order.firstEventDate}
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
                      {`${order.printAddress.streetAddress}, ${order.printAddress.city}, ${order.printAddress.state} ${order.printAddress.postalCode}`}
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
          </div>
        </div>
      </div>

      <ChangeStatusModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
}

export default OrderInfo;
