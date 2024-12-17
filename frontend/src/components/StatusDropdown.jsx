import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobal } from "@/context/GlobalContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { use } from "react";

const StatusDropdown = ({
  order = {},
  status = "",
  setFilteredOrders,
  setOrders,
  setCompleteOrder,
}) => {
  const { baseUrl } = useGlobal();
  const [loading, setLoading] = useState(false);

  //? -------------------------------
  //? Change status
  //? -------------------------------
  async function handleStatusChange(status) {
    setLoading(true);
    try {
      console.log(order.type, status, order._id);
      const res = await toast.promise(
        axios.patch(
          `${baseUrl}/api/orders/change-status`,
          { status, orderId: order._id, orderType: order.type },
          { withCredentials: true }
        ),
        {
          loading: "Updating status...",
          success: "Status updated successfully",
        }
      );
      if (res.status === 200) {
        setOrders?.((prev) =>
          prev.map((o) => (o._id === order._id ? { ...o, status } : o))
        );
        setFilteredOrders?.((prev) =>
          prev.map((o) => (o._id === order._id ? { ...o, status } : o))
        );
        setCompleteOrder?.((prev) => ({ ...prev, status }));
      } else {
        toast.error(res.data.msg || "Error updating status. Please try again");
      }
    } catch (error) {
      toast.error("Server Error. Please try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { }, [order]);

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <button
          className=" w-full capitalize text-left h-full focus:outline-none hover:bg-gray-100 px-2 rounded-md btn-dropdown"
        >
          {status ? status : "Change status"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {["pending", "installed", "completed"].map((status, index) => (
          <DropdownMenuItem key={index}>
            <button
              disabled={loading}
              onClick={() => handleStatusChange(status)}
              className=" capitalize "
            >
              {status}
            </button>
          </DropdownMenuItem>
        ))}
        {order?.type === "postOrder" && (
          <DropdownMenuItem key="postOrder">
            <button
              onClick={() => handleStatusChange("removed")}
              disabled={loading}
              className=" capitalize"
            >
              Remove
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
