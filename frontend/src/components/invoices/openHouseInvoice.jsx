import React from "react";
import { parseDate } from "../../helpers/utilities";

const OpenHouseInvoice = ({ data }) => {
  return (
    <>
      <div
        id="openHouse"
        className="max-w-[790px] mx-auto bg-[#fff] border border-[#c8c8cb]"
      >
        <div className="bg-[#166534] text-[#fff] flex py-4 px-10 justify-between">
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <h2 className="text-lg">{data?._id}</h2>{" "}
          {/* Updated to use _id for MongoDB document ID */}
        </div>

        <div className="p-8 pt-0">
          <div className="flex justify-between mt-4">
            <div>
              <p>Received:</p>
              <p>{parseDate(data.requestedDate)}</p>
            </div>
            <div>
              <p className="font-bold pb-3">Propped Up Sign Services</p>
              <p>1234 Main St, Bay Area, CA 12345</p>{" "}
              {/* companyAddress placeholder */}
              <p>info@proppedupbayarea.com</p>
              <p>510.661.3100</p>
            </div>
          </div>

          <h3 className="text-center text-xl font-bold my-4">
            OPEN HOUSE SIGN ORDER FORM
          </h3>
          <div className="border-t border-[#c8c8cb] my-4"></div>

          <div className="flex justify-between gap-4">
            <div>
              <h4 className="font-bold">
                {data.firstName} {data.lastName}
              </h4>
              <p>Date of First Event: {parseDate(data.requestedDate)}</p>
              <p>
                Zone: {data.requiredZone.name} - {data.requiredZone.text}
              </p>
              <p>
                Time of First Event: {data.firstEventStartTime} -{" "}
                {data.firstEventEndTime}
              </p>
              <p>Event Address (First Event):</p>
              <p>
                {data.firstEventAddress.streetAddress}{" "}
                {data.firstEventAddress.streetAddress2}
              </p>
              <p>
                {data.firstEventAddress.city}, {data.firstEventAddress.state}{" "}
                {data.firstEventAddress.postalCode}
              </p>
            </div>
            <div className="text-right">
              <div className="border-t border-[#c8c8cb] my-4"></div>

              <div className="flex justify-between">
                <h4 className="font-bold">Total</h4>
                <span className="font-bold">{data.total} USD</span>
              </div>

              <div className="border-t border-[#c8c8cb] my-2"></div>
              <div className="text-left">
                <h4 className="font-bold">Payer Information</h4>
                <p>
                  {data.firstName} {data.lastName}
                </p>
                <p>{data.email}</p>
                <p>{data.phone}</p>

                <div className="border-t border-[#c8c8cb] my-2"></div>
                <h4 className="font-bold">Transaction ID</h4>
                <p>{data.transactionId || "N/A"}</p>

                <div className="border-t border-[#c8c8cb] my-2"></div>
                <h4 className="font-bold">Payment Method</h4>
                <p>{data.paymentMethod || "N/A"}</p>

                <div className="border-t border-[#c8c8cb] my-2"></div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#c8c8cb] my-4"></div>
          <div>
            <h4 className="font-bold">Additional Information</h4>
            <p>Address Print on Sign: {data.printAddressSign ? "Yes" : "No"}</p>
            <p>
              Additional Sign Quantity: {data.additionalSignQuantity} ($5 per
              sign)
            </p>
            <p>Twilight Tour: {data.twilightTourSlot}</p>
            <p>Rush Fee: {data.rushFee ? `${data.rushFee} USD` : "N/A"}</p>
          </div>

          <div className="border-t border-[#c8c8cb] my-4"></div>
          <div className="my-4 font-bold">THANK YOU</div>
          <div className="border-b-2 border-[#000000] w-full"></div>
          <div className="my-4">
            <img src="/logo.png" alt="Company Logo" />
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenHouseInvoice;
