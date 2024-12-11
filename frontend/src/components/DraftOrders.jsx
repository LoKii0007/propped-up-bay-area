import React, { useEffect, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import toast from "react-hot-toast";
import RowHeading from "@/ui/rowHeading";
import axios from "axios";
import { parseDate } from "@/helpers/utilities";
import Loader from "./ui/loader";
import DeleteOrderModal from "@/ui/DeleteOrderModal";

function DraftOrders() {
  const [activeForm, setActiveForm] = useState("openHouseForm");
  const [draftOrders, setDraftOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([])
  const { baseUrl, setBreadCrumb, setActiveView, setDraft } = useGlobal();
  const [openHouseDraftCount, setOpenHouseDraftCount] = useState(0)
  const [postOrderDraftCount, setPostOrderDraftCount] = useState(0)
  const [nextLoad, setNextLoad] = useState(null)
  const [open, setOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteOrder, setDeleteOrder] = useState(null)
  const [page, setPage] = useState(1);
  const limit = 20;


  async function handleOrderClick(order) {
    setBreadCrumb('Order')
    setActiveView('order')
    setDraft(order)
  }

  //?----------------------------
  //? ----Fetch intial orders
  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/orders/draft-orders`, {
        params : {
          page,
          limit
        },
        withCredentials: true,
        validateStatus: (status) => status < 500
      });
      if (response.status !== 200) {
        console.log("No orders found");
      } else {
        setOpenHouseDraftCount(response.data.openHouseCount)
        setPostOrderDraftCount(response.data.postOrderCount)
        setDraftOrders(response.data.orders);
        setFilteredOrders(response.data.orders.filter((order) => order.type === activeForm));
      }
    } catch (error) {
        console.log("Error in fetchOrders", error.message);
      toast.error("Server error fetching draft orders");
    } finally {
      setLoading(false);
    }
  }

  //?----------------------------
  //? ----Load more orders
  async function handleNextOrder() {
    try {
      setNextLoad(true)
      const response = await axios.get(`${baseUrl}/api/orders/draft-order`, {
        params : {
          page: page + 1,
          limit
        },
        withCredentials: true,
        validateStatus: (status) => status < 500
      });
      if (response.status !== 200) {
        console.log("No orders found");
      } else {
        setPage((prev) => prev + 1)
        const updatedOrder = [...draftOrders, response.data.order];
        setDraftOrders(updatedOrder);
      }
    } catch (error) {
      console.log("Error in handleNextOrder", error.message);
    } finally {
      setNextLoad(false)
    }
  }

  //?----------------------------
  //? ----Delete order

  function handleDeleteBtn(order) {
    setOpen(true)
    setDeleteOrder(order)
  }

  async function handleDelete(order) {
    try {
      setDeleteLoading(true)
      const response = await axios.delete(`${baseUrl}/api/orders/draft-order`, {
        data: { orderId: deleteOrder._id, type: deleteOrder.type },
        withCredentials: true,
        validateStatus: (status) => status < 500
      });
      if (response.status !== 200) {
        toast.error("Error deleting order");
      } else {
        toast.success("Order deleted successfully");
        setDraftOrders(draftOrders.filter((draft) => draft._id !== order._id));
      }
    } catch (error) {
      console.log("Error in handleDelete", error.message);
    } finally {
      setDeleteLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeForm === "openHouseForm") {
      setFilteredOrders(draftOrders.filter((order) => order.type === "openHouse"));
    } else {
      setFilteredOrders(draftOrders.filter((order) => order.type === "postOrder"));
    }
  }, [activeForm, draftOrders]);

  useEffect(() => {
  }, [filteredOrders, deleteOrder]);

  return (
    <>
      <div className="order flex flex-col rounded-md gap-2 py-5 h-full md:gap-6 ">
        <div className="order-top grid grid-cols-2 mx-10 px-2 sticky top-0 md:static md:top-0 ">
          <button
            onClick={() => setActiveForm("openHouseForm")}
            className={` ${
              activeForm === "openHouseForm"
                ? "bg-[#638856] text-white "
                : "text-[#A1A1A1] bg-[#D9D9D9] "
            } py-6 rounded-l-lg text-2xl font-bold `}
          >
            Open House Order
          </button>
          <button
            onClick={() => setActiveForm("postOrder")}
            className={` ${
              activeForm === "postOrder"
                ? "bg-[#638856] text-white"
                : "text-[#A1A1A1] bg-[#D9D9D9]"
            } py-6 rounded-r-lg text-2xl font-bold`}
          >
            Post Order
          </button>
        </div>
        <div className="order-bottom pb-[80px] md:pb-0 h-full mx-10 px-2 ">
          <div className="flex items-center w-full">
            <div className=" text-[#718096] grid grid-cols-2 md:grid-cols-4 gap-2 px-5 w-[80%] items-center ">
              <RowHeading
                data={filteredOrders}
                setFilteredData={setFilteredOrders}
                filterValue={"createdAt"}
                text="Date"
              />
              <RowHeading
                data={filteredOrders}
                setFilteredData={setFilteredOrders}
                filterValue={"email"}
                text="Email"
              />
              <RowHeading
                data={filteredOrders}
                setFilteredData={setFilteredOrders}
                filterValue={`${activeForm === 'openHouseForm' ? 'firstEventAddress.streetAddress' : 'billingAddress.streetAddress'}`}
                text="Address"
              />
              <div>Action</div>
            </div>
          </div>
          <div className="draft-bottom flex flex-col w-full text-center ">
            { loading ? <div className="font-semibold w-full">Loading...</div> : filteredOrders.length > 0 ? (
              <>
                {  filteredOrders?.length > 0 && filteredOrders?.map((order) => (
                  <div className="flex items-center w-full py-5 text-left ">
                    <button onClick={() => handleOrderClick(order)}  className="grid grid-cols-4 gap-2 px-5 w-[80%] items-center text-left ">
                      <div className="overflow-hidden text-ellipsis text-nowrap">{parseDate(order.createdAt)}</div>
                      <div className="overflow-hidden text-ellipsis text-nowrap">{order.email}</div>
                      <div className="overflow-hidden text-ellipsis text-nowrap ">
                        {activeForm === 'openHouseForm' ? order?.firstEventAddress?.streetAddress + ' ' + order?.firstEventAddress?.streetAddress2 + ' ' + order?.firstEventAddress?.city + ' ' + order?.firstEventAddress?.state + ' ' + order?.firstEventAddress?.postalCode : order?.billingAddress?.streetAddress + ' ' + order?.billingAddress?.streetAddress2 + ' ' + order?.billingAddress?.city + ' ' + order?.billingAddress?.state + ' ' + order?.billingAddress?.postalCode}
                      </div>
                      <div className="overflow-hidden"></div>
                    </button>
                    <button onClick={() => handleDeleteBtn(order)}>Delete</button>
                  </div>
                ))}
              </>
            ) : (
              <div>No open house orders</div>
            )}

            <div className="flex items-center justify-center ">

            {
              activeForm === "openHouseForm" && openHouseDraftCount > filteredOrders?.length && (
                <button className="flex items-center justify-center px-5 py-2 rounded-md bg-[#638856] text-white" disabled={nextLoad} onClick={handleNextOrder}>{nextLoad ? <Loader/> : "Load More"}</button>
              )
            }

            {
              activeForm === "postOrder" && postOrderDraftCount > filteredOrders?.length && (
                <button className="flex items-center justify-center px-5 py-2 rounded-md bg-[#638856] text-white" disabled={nextLoad} onClick={handleNextOrder}>{nextLoad ? <Loader/> : "Load More"}</button>
              )
            }
            </div>
          </div>
        </div>
      </div>

      <DeleteOrderModal open={open} setOpen={setOpen} handleDelete={handleDelete} loading={deleteLoading} />
    </>
  );
}

export default DraftOrders;
