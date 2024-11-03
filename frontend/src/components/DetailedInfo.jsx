import React, { useEffect, useState } from "react";
import ActionsDropdown from "../ui/ActionsDropdown";
import axios from "axios";
import { UseGlobal } from "../context/GlobalContext";
import toast from "react-hot-toast";

function DetailedInfo({ user }) {
  const { baseUrl } = UseGlobal();
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details from backend
  async function getUserDetails() {
    try {
      const res = await axios.get(`${baseUrl}/api/userDetails/get`, {
        params: { userId: user._id },
        withCredentials: true,
      });
      if (res.status !== 200) {
        toast.error(res.data.message || "Error fetching details.");
      }
      setUserDetails(res.data.userDetails);
    } catch (error) {
      console.error("Server error. Please try again", error);
    }
  }

  // Fetch data on mount or when userId changes
  useEffect(() => {
    if (user) {
      getUserDetails();
    }
  }, [user]);

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  if (!userDetails) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
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
        <div className="mb-8">
          <h2 className="text-xl font-bold">Customer</h2>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-400">Total orders</p>
            <p className="text-gray-600">{user.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total spent</p>
            <p className="text-gray-600">{user.totalSpent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Company</p>
            <p className="text-gray-600">{userDetails.company}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">CA DRE License</p>
            <p className="text-gray-600">{userDetails.caDreLicense}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Address</p>
            <p className="text-gray-600">{userDetails.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">City</p>
            <p className="text-gray-600">{userDetails.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">State</p>
            <p className="text-gray-600">{userDetails.state}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Zip Code</p>
            <p className="text-gray-600">{userDetails.zipCode}</p>
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
              <p>{user.email}</p>
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
              <p>{userDetails.workPhone}</p>
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
              <p>{userDetails.mobilePhone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedInfo;
