import React from "react";
import ActionsDropdown from "../ui/ActionsDropdown";

function DetailedInfo() {
    
  return (
    <>
      <div className="bg-white w-full h-full px-[5%] flex flex-col overflow-y-auto ">
        <div className="flex justify-between mb-8 w-full ">
          <button className="text-[#718096] border px-4 py-2 rounded-lg hover:bg-gray-100">
            User Details
          </button>
          <div className="flex space-x-4">
            <ActionsDropdown />
          </div>
        </div>

        <div className="px-12 mx-auto w-8/12 ">
          <div className=" mb-8">
            <h2 className="text-xl font-bold">Customer</h2>
            <p className="text-[#718096]">Darcel Ballentine</p>
            <p className="text-gray-400">10 orders</p>
          </div>

          <div className="flex flex-col gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-400">Company</p>
              <p className="text-gray-600">Company Name</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">First Name</p>
              <p className="text-gray-600">Darcel</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Name</p>
              <p className="text-gray-600">Ballentine</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">CA DRE License</p>
              <p className="text-gray-600">123456789</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-[#718096]">
                <div className="text-[#34CAA5]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-mail"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <p>darcelballentine@mail.com</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-[#718096]">
                <div className="text-[#34CAA5]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-phone"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <p>(671) 555-0110</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Shipping Address</h3>
            <div className="flex items-center space-x-2 text-[#718096]">
              <div className="text-[#34CAA5]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-map-pin"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p>2715 Ash Dr. San Jose, South Dakota 83475</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Billing Address</h3>
            <div className="flex items-center space-x-2 text-[#718096]">
              <div className="text-[#34CAA5]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-map-pin"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p>Same as shipping address</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailedInfo;
