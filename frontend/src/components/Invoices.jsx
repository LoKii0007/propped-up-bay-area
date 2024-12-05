import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import OpenHouseInvoice from "./invoices/openHouseInvoice";
import toast from "react-hot-toast";
import PostOrderInvoice from "./invoices/postOrderInvoice";
import ReactDOM from "react-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import RowHeading from "../ui/rowHeading";
import Pagination from "./pagination";
import { useGlobal } from "../context/GlobalContext";
import InvoiceDownload from "./invoiceDownload";
import axios from "axios";
import DatePickerWithRange from "./ui/DatePickerWithRange";
import StartDatePicker from "./ui/StartDatePicker";
import EndDatePicker from "./ui/EndDatePicker";

function Invoices() {
  const [orders, setOrders] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState(orders);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderType, setOrderType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceData, setInvoiceData] = useState();
  const { setBreadCrumb, isInfo, setIsInfo, baseUrl } = useGlobal();
  const [nextLoading, setnextLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [totalOrderCount, setTotalOrderCount] = useState(0)
  const limit = 10;

  //? ------------------------
  //? pagination
  //? ------------------------
  const [displayCount, setDisplayCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(orders.length / displayCount)
  );
  const [startPage, setStartPage] = useState(1);
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;

  //? ----------------------------------
  //? loading initial orders
  //? ---------------------------------
  async function handleOrders() {
    try {
      const res = await axios.get(`${baseUrl}/api/orders/get-all`, {
        params: { page: orderPage, limit },
        withCredentials: true, validateStatus: (status) => status < 500
      });
      if (res.status === 404) {
        toast.custom(res.data.message || 'no orders found');
      } else if (res.status === 200) {
        const allOrders = res.data.orders;
        setOrders(allOrders);
        setTotalOrderCount(res.data.couunt)
        setFilteredInvoices(allOrders);
        // setTotalPages(Math.ceil(allOrders.length / displayCount));
        resetPagination(allOrders)
      } else {
        toast.error(res.data.message || 'Error fetching invoices. Please try again')
      }
    } catch (error) {
      toast.error('Server error. Please try again')
    }
  }

  //? ----------------------------------
  //? loading next orders
  //? ---------------------------------
  async function handleNextOrders() {
    setnextLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/orders/get-all`, {
        params: { page: orderPage + 1, limit },
        withCredentials: true,
        validateStatus: (status) => status < 500
      });
      if (res.status === 404) {
        toast(res.data.message || "no more orders found")
      }
      else if (res.status === 200) {
        setOrderPage((prev) => prev + 1);
        const allOrders = [...orders, ...res.data.orders];
        setFilteredInvoices(allOrders);
        setOrders(allOrders);
        // setTotalPages(Math.ceil(allOrders.length / displayCount));
        resetPagination(allOrders);
        console.log("res : ", allOrders);
      } else {
        toast.error(res.data.message || "Error fetching invoices. Please try again");
      }
    } catch (error) {
      toast.error("Server error. Please try again");
    } finally {
      setnextLoading(false);
    }
  }

  useEffect(() => {
    handleOrders();
  }, []);

  //? -------------------------
  //? pagination resets
  //?--------------------------
  function resetPagination(filtered) {
    setTotalPages(Math.ceil(filtered.length / displayCount));
    setCurrentPage(1); // Reset to first page when filtering
    setStartPage(1); // Reset page range to the beginning when filtering
  }

  //? ---------------------------
  //? filter date - bulk downloads
  //? ---------------------------
  function handleDateFilter() {
    // Ensure startDate and endDate are valid
    if (!startDate || !endDate) {
      toast.error("Both start date and end date are required");
      return [];
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start) || isNaN(end)) {
      toast.error("Invalid date format. Please provide valid dates.");
      return [];
    }

    // Ensure that startDate is before or equal to endDate
    if (start > end) {
      toast.error("Start date cannot be after end date");
      return [];
    }

    return orders.filter((data) => {
      const invoiceDate = new Date(data.createdAt);

      // Ensure invoiceDate is a valid date
      if (isNaN(invoiceDate)) {
        console.warn(`Invalid date in orders: ${data.createdAt}`);
        return false;
      }

      return invoiceDate >= start && invoiceDate <= end;
    });
  }


  //? ---------------------------
  //? invoice info
  //? ---------------------------
  function handleInvoice(index) {
    const details = filteredInvoices[index];
    console.log("details : ", details);
    if (details) {
      setBreadCrumb("Invoice info"); //updating breadcrumb
      setInvoiceData(details);
      setIsInfo(true);
    }
  }

  //? -----------------------
  //? downloads - bulk
  //? -----------------------
  function handleAllinvoice() {
    if (!startDate || !endDate) {
      return toast.error("select range");
    }
    const filtered = handleDateFilter();
    if (filtered.length === 0) {
      return toast.error("no invoices found");
    }
    filtered.forEach((data, index) => {
      const container = document.createElement("div");
      container.style.display = "none";
      document.body.appendChild(container);

      // Render the appropriate component based on the invoice type
      if (data.type === "openHouse") {
        const element = <OpenHouseInvoice data={data} />;
        ReactDOM.render(element, container);
      } else if (data.type === "postOrder") {
        const element = <PostOrderInvoice data={data} />;
        ReactDOM.render(element, container);
      }

      const invoiceElement = container.firstChild;
      const filename = `${data.type}_invoice_${index}.pdf`;

      const opt = {
        margin: 1,
        filename: filename,
        html2canvas: { scale: 2 },
      };

      html2pdf()
        .from(invoiceElement)
        .set(opt)
        .save()
        .then(() => {
          toast.success(`Downloaded ${filename}`);
          ReactDOM.unmountComponentAtNode(container); // Unmount and cleanup
          document.body.removeChild(container);
        })
        .catch((error) => console.error("PDF Generation Error:", error));
    });
  }

  //? ---------------------------
  //? filter - search
  //? ---------------------------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (orders.length === 0) {
      return;
    }
    const filtered = orders.filter((order) =>
      Object.entries(order).some(([key, value]) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm);
        }
        return false;
      })
    );

    setFilteredInvoices(filtered); // updating parent
    resetPagination(filtered); // reset pagination
  }, [searchTerm]);


  //? ---------------------------
  //? filter - ordertype
  //? ---------------------------
  const handleOrderType = (type) => {
    let filtered = orders;
    setOrderType(type); // updating order type

    if (type === "all") {
      setFilteredInvoices(orders);
    } else {
      // applying the clicked filter
      filtered = filtered.filter(
        (order) => order.type.toLowerCase() === type.toLowerCase()
      );
      setFilteredInvoices(filtered);
    }

    resetPagination(filtered); // reset pagination
  };

  //? -----------------------
  //? download - single invoice
  //? -----------------------
  function handleSingleDownload(data) {
    try {
      const container = document.createElement("div");
      container.style.display = "none";
      document.body.appendChild(container);

      // Render the appropriate component based on the invoice type
      let element;
      if (data.type === "openHouse") {
        element = <OpenHouseInvoice data={data} />;
      } else if (data.type === "postOrder") {
        element = <PostOrderInvoice data={data} />;
      } else {
        toast.error("Download failed. Please try again");
        return;
      }

      // Render the invoice component
      ReactDOM.render(element, container);

      const invoiceElement = container.firstChild;
      const filename = `${data.type}_invoice.pdf`;

      const options = {
        margin: 1,
        filename,
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4" },
      };

      // Generate and download PDF
      html2pdf()
        .from(invoiceElement)
        .set(options)
        .save()
        .then(() => {
          toast.success(`Downloaded ${filename}`);
          ReactDOM.unmountComponentAtNode(container);
          document.body.removeChild(container); // Clean up
        })
        .catch((error) => {
          console.error("PDF Generation Error:", error);
          toast.error("Error generating PDF. Please try again.");
        });
    } catch (error) {
      toast.error("Something went wrong");
      console.error("PDF Generation Error:", error);
    }
  }

  //? ---------------------------
  //? updating render
  //? ---------------------------
  useEffect(() => {
    // console.log(filteredInvoices);
  }, [filteredInvoices, orders, totalOrderCount]);

  return (
    <>
      {!isInfo ? (
        <div className="invoices rounded-[20px] w-full h-full flex flex-col">
          <div className="invoice-filter mt-4 w-full flex gap-6 font-medium mb-6 items-center">
            <div className="filter-left w-1/3">
              <div className="search rounded-md bg-[#f5f5f5] flex items-center px-3">
                <div className="search-icon ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </div>
                <input
                  name="searchBox"
                  className="w-full py-2 px-3 focus-visible:outline-none bg-[#f5f5f5]"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e)}
                  placeholder="Search by name or invoice no"
                />
              </div>
            </div>
            <div className="filter-right mx-auto grid grid-cols-3 gap-5 w-2/3 items-center ">
              <Menu as="div" className="relative inline-block py-1">
                <div>
                  <MenuButton className="inline-flex capitalize w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                    {orderType}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 h-5 w-5 text-gray-400"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-3 flex flex-col gap-2 ">
                    <MenuItem>
                      {({ close }) => (
                        <button
                          className=""
                          onClick={() => {
                            handleOrderType("all");
                            close(); // Closes the dropdown
                          }}
                        >
                          All
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ close }) => (
                        <button
                          onClick={() => {
                            handleOrderType("openHouse");
                            close(); // Closes the dropdown
                          }}
                        >
                          OpenHouse
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ close }) => (
                        <button
                          onClick={() => {
                            handleOrderType("postOrder");
                            close(); // Closes the dropdown
                          }}
                        >
                          PostOrder
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>

              <div className="grid grid-cols-2 gap-3 border rounded-md ">
                <StartDatePicker
                  date={startDate}
                  selectedDate={(newDate) => setStartDate(newDate)}
                />

                <EndDatePicker
                  date={endDate}
                  selectedDate={(newDate) => setEndDate(newDate)}
                />
              </div>

              <button className="border border-gray-300 rounded-md bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-100" onClick={handleAllinvoice}>Download range</button>
            </div>
          </div>

          <div className="inoice-top grid grid-cols-3 w-full px-5 rounded-2xl text-[#718096] items-center font-medium">
            <RowHeading
              setFilteredData={setFilteredInvoices}
              filterValue="firstName lastName" // filtering basis
              data={filteredInvoices}
              text="Customer name"
            />
            <RowHeading
              setFilteredData={setFilteredInvoices}
              filterValue="_id" // filtering basis
              data={filteredInvoices}
              text="Invoice No."
            />
            <div className="py-5">Download</div>
          </div>
          <div className="inoice-bottom w-full gap-4 flex flex-col justify-between h-full ">
            <div className="w-full px-5 gap-2 flex flex-col font-medium">
              {filteredInvoices
                ?.slice(startIndex, endIndex)
                ?.map((data, index) => (
                  <div key={index} className="w-full flex">
                    <button
                      onClick={() => handleInvoice(index)}
                      className="grid grid-cols-2 w-2/3"
                    >
                      <div className="text-left py-3">
                        {data.firstName} {data.lastName}
                      </div>
                      <div className="text-left py-3">{`PRB${String(data?.orderNo).padStart(5, '0')}`}</div>
                    </button>

                    <button
                      onClick={() => handleSingleDownload(data)}
                      className="text-left bg-[#34CAA5] px-5 w-fit rounded-md"
                    >
                      Download
                    </button>
                  </div>
                ))}
              {orders.length < totalOrderCount && currentPage === totalPages && (
                <div className="flex justify-center">
                  {nextLoading ? (
                    "loading..."
                  ) : (
                    <button
                      onClick={() => handleNextOrders()}
                      className="bg-yellow-500 py-2 px-4 rounded-md my-3 "
                    >
                      Load more
                    </button>
                  )}
                </div>
              )}
            </div>
            <Pagination
              startPage={startPage}
              setStartPage={setStartPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              displayCount={displayCount}
              setDisplayCount={setDisplayCount}
              filtered={filteredInvoices}
            />
          </div>
        </div>
      ) : (
        <InvoiceDownload invoiceDetails={invoiceData} />
      )}
    </>
  );
}

export default Invoices;
