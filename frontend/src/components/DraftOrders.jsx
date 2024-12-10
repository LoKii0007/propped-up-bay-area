import React, { useEffect, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import toast from "react-hot-toast";
import RowHeading from "@/ui/rowHeading";
import axios from "axios";
import { parseDate } from "@/helpers/utilities";

function DraftOrders() {
  const [activeForm, setActiveForm] = useState("openHouseForm");
  const [draftOrders, setDraftOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openHouseOrders, setOpenHouseOrders] = useState([]);
  const [postOrders, setPostOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([])
  const { baseUrl, setBreadcrumb, setActiveView } = useGlobal();
  const [page, setPage] = useState(1);
  const limit = 20;


  async function handleOrderClick(order) {
    console.log(order);
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
        withCredentials: true
      });
      if (response.status !== 200) {
        console.log("No orders found");
      } else {
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

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeForm === "openHouseForm") {
      setFilteredOrders(draftOrders.filter((order) => order.type === "openHouse"));
    } else {
      setFilteredOrders(draftOrders.filter((order) => order.type === "postOrder"));
    }
  }, [activeForm]);

  useEffect(() => {
  }, [filteredOrders]);

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
                data={openHouseOrders}
                setFilteredData={setOpenHouseOrders}
                filterValue={"createdAt"}
                text="Date"
              />
              <RowHeading
                data={openHouseOrders}
                setFilteredData={setOpenHouseOrders}
                filterValue={"email"}
                text="Email"
              />
              <RowHeading
                data={openHouseOrders}
                setFilteredData={setOpenHouseOrders}
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
                    <button>Delete</button>
                  </div>
                ))}
              </>
            ) : (
              <div>No open house orders</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DraftOrders;
