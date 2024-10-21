import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import OpenHouseInvoice from "./invoices/openHouseInvoice";
import toast from "react-hot-toast";
import PostOrderInvoice from "./invoices/postOrderInvoice";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import RowHeading from "../ui/rowHeading";
import Pagination from "./pagination";
import { UseGlobal } from "../context/GlobalContext";
import InvoiceDownload from "../screens/invoiceDownload";

const date = new Date();

const invoiceDataType = {
  NAME: "name",
  INVOICENO: "invoiceNo",
  AMOUNT: "amount",
  ID: "id",
  DATE: "date",
};

const InvoiceData = [
  {
    typeOf: "openHouse",
    invoiceNo: "sjhcbsjhbdcjs",
    name: "sample@gmail.com",
    amount: 1000,
    date: date,
  },
  {
    typeOf: "postOrder",
    invoiceNo: "cbekrj3buib4b3bsd",
    name: "sample6@gmail.com",
    amount: 1700,
    date: date,
  },
  {
    typeOf: "postOrder",
    invoiceNo: "cbekrj3buib4b3bsd",
    name: "sample6@gmail.com",
    amount: 1700,
    date: date,
  },
];

export const InvoiceTypes = {
  OPENHOUSE: "openHouse",
  POSTORDER: "postOrder",
};

function Invoices() {
  const navigate = useNavigate();
  const [filteredInvoices, setFilteredInvoices] = useState(InvoiceData);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [orderType, setOrderType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceData, setInvoicedata] = useState()
  const { setBreadCrumb, isInfo, setIsInfo } = UseGlobal();

  //? ------------------------
  //? pagination
  //? ------------------------
  const [displayCount, setDisplayCount] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(InvoiceData.length / displayCount)
  );
  const [startPage, setStartPage] = useState(1);
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;

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
  function handleFilter() {
    return InvoiceData.filter((data) => {
      const invoiceDate = new Date(data.formData.date);
      return (
        invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate)
      );
    });
  }



  function handleInvoice(data) {
    setBreadCrumb("Invoice info"); //updating breadcrumb
    setInvoicedata(data)
    if(invoiceData) setIsInfo(true); //changing view
  }

  //? -----------------------
  //? downloads - bulk
  //? -----------------------
  function handleAllinvoice() {
    if (!startDate || !endDate) {
      return toast.error("select range");
    }
    const filtered = handleFilter();
    if (filtered.length === 0) {
      return toast.error("no invoices found");
    }
    filteredInvoices.forEach((data, index) => {
      const container = document.createElement("div");
      container.style.display = "none";
      document.body.appendChild(container);

      // Render the appropriate component based on the invoice type
      if (data.typeOf === InvoiceTypes.OPENHOUSE) {
        const element = <OpenHouseInvoice data={data} />;
        ReactDOM.render(element, container);
      } else if (data.typeOf === InvoiceTypes.POSTORDER) {
        const element = <PostOrderInvoice data={data} />;
        ReactDOM.render(element, container);
      }

      const invoiceElement = container.firstChild;
      const filename = `${data.typeOf}_invoice_${index}.pdf`;

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

  //? ---------------------------
  //? filter - ordertype
  //? ---------------------------
  const handleOrderType = (type) => {
    let filtered;
    if (type === "all") {
      setOrderType(type);
      setFilteredInvoices(InvoiceData); //updating parent
      filtered = InvoiceData;
    } else {
      setOrderType(type);
      filtered = InvoiceData.filter(
        (invoice) => invoice.typeOf.toLowerCase() === type.toLowerCase()
      );
      setFilteredInvoices(filtered); //updating parent
    }
    resetPagination(filtered); // reset pagination
  };

  //? -----------------------
  //? download - single invoice
  //? -----------------------
  function handleSingleDownload(data) {
    const container = document.createElement("div");
    container.style.display = "none";
    document.body.appendChild(container);

    // let root = createRoot(container)

    // Render the appropriate component based on the invoice type
    if (data.typeOf === InvoiceTypes.OPENHOUSE) {
      const element = <OpenHouseInvoice data={data} />;
      ReactDOM.render(element, container);
    } else if (data.typeOf === InvoiceTypes.POSTORDER) {
      const element = <PostOrderInvoice data={data} />;
      ReactDOM.render(element, container);
    }

    const invoiceElement = container.firstChild;
    const filename = `${data.typeOf}_invoice.pdf`;

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
      .catch((error) => {
        toast.error("something went wrong");
        console.error("PDF Generation Error:", error);
      });
  }

  //? ---------------------------
  //? updating render
  //? ---------------------------
  useEffect(() => {}, [filteredInvoices, setFilteredInvoices]);

  return (
    <>
      {!isInfo ?
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
                onChange={handleSearch}
                placeholder="Search by name or invoice no"
              />
            </div>
          </div>
          <div className="filter-right mx-auto grid grid-cols-4 gap-5 w-2/3">
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

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
            />
            <button onClick={handleAllinvoice}>Download All</button>
          </div>
        </div>

        <div className="inoice-top grid grid-cols-3 w-full px-5 rounded-2xl text-[#718096] items-center font-medium">
          <RowHeading
            setFilteredData={setFilteredInvoices}
            filterValue={invoiceDataType.NAME}
            data={filteredInvoices}
            text="Customer name"
          />
          <RowHeading
            setFilteredData={setFilteredInvoices}
            filterValue={invoiceDataType.INVOICENO}
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
                    onClick={() => handleInvoice(data)}
                    className="grid grid-cols-2 w-2/3"
                  >
                    <div className="text-left py-3">{data.name}</div>
                    <div className="text-left py-3">{data.invoiceNo}</div>
                  </button>

                  <button
                    onClick={() => handleSingleDownload(data)}
                    className="text-left bg-[#34CAA5] px-5 w-fit rounded-md"
                  >
                    {" "}
                    Download{" "}
                  </button>
                </div>
              ))}
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

      : (
        <InvoiceDownload InvoiceData={invoiceData} />
      )
    }
    </>
  );
}

export default Invoices;
