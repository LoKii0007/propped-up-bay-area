import toast from "react-hot-toast";
import { UseGlobal } from "../context/GlobalContext";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ChangeStatusDropdown({
  order,
  setOrders,
  setFilteredOrders,
  setCompleteOrder,
  status,
}) {
  const { baseUrl } = UseGlobal();
  const [loading, setLoading] = useState(false);

  //? -------------------------------
  //? change status
  //? -------------------------------
  async function handleStatusChange(status) {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${baseUrl}/api/orders/change-status`,
        { status, orderId: order._id, orderType: order.type },
        { withCredentials: true }
      );
      if (res.status !== 200) {
        toast.error(res.data.msg || "Error updating status. Please try again");
      } else {
        toast.success("status updated successfully", { position: "top-right" });
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? { ...o, status } : o))
        );
        setFilteredOrders((prev) =>
          prev.map((o) => (o._id === order._id ? { ...o, status } : o))
        );
        setCompleteOrder((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error("Server Error. Please try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {}, [order]);

  return (
    <>
      <Menu as="div" className="relative inline-block w-full">
        <div className="w-full" >
          {status ? 
          <MenuButton
            className={`capitalize w-full flex gap-x-1.5 font-semibold hover:bg-gray-50`}
          >
            {status}
            <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 h-5 w-5 text-gray-400"
            />
          </MenuButton> :
          <MenuButton
            className={`inline-flex capitalize w-full justify-center gap-x-1.5 border-[1px] border-[#34CAA5] rounded-md px-3 py-2 text-sm font-semibold text-[#718096] hover:bg-gray-50`}
          >
            Change status
            <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 h-5 w-5 text-gray-400"
            />
          </MenuButton>
}
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-3 flex flex-col gap-2 ">
            <MenuItem>
              {({ close }) => (
                <button
                  disabled={loading}
                  className="flex px-3 gap-3 items-center text-[#718096] hover:text-black hover:bg-gray-300 py-2 "
                  onClick={() => {
                    handleStatusChange("pending");
                    close(); // Closes the dropdown
                  }}
                >
                  Pending
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ close }) => (
                <button
                  disabled={loading}
                  className="flex px-3 gap-3 items-center text-[#718096] hover:text-black hover:bg-gray-300 py-2 "
                  onClick={() => {
                    handleStatusChange("completed");
                    close(); // Closes the dropdown
                  }}
                >
                  Completed
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ close }) => (
                <button
                  disabled={loading}
                  className="flex px-3 gap-3 items-center text-[#718096] hover:text-black hover:bg-gray-300 py-2 "
                  onClick={() => {
                    handleStatusChange("installed");
                    close(); // Closes the dropdown
                  }}
                >
                  Installed
                </button>
              )}
            </MenuItem>
            {order?.type === "postOrder" && (
              <MenuItem>
                {({ close }) => (
                  <button
                    disabled={loading}
                    className="flex px-3 gap-3 items-center text-[#718096] hover:text-black hover:bg-gray-300 py-2 "
                    onClick={() => {
                      handleStatusChange("removed");
                      close(); // Closes the dropdown
                    }}
                  >
                    Removed
                  </button>
                )}
              </MenuItem>
            )}
          </div>
        </MenuItems>
      </Menu>
    </>
  );
}
