import React, { useEffect, useState } from 'react'
import html2pdf from 'html2pdf.js'
import OpenHouseInvoice from './invoices/openHouseInvoice'
import toast from 'react-hot-toast'
import PostOrderInvoice from './invoices/postOrderInvoice'
import { useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom'

const date = new Date()

const InvoiceData = [
  {
    typeOf: 'openHouse',
    formData: {
      id: 'sjhcbsjhbdcjs',
      email: 'sample@gmail.com',
      amount: 1000,
      date: date
    }
  },
  {
    typeOf: 'postOrder',
    formData: {
      id: 'cbekrj3buib4b3bsd',
      email: 'sample6@gmail.com',
      amount: 1700,
      date: date
    }
  },
  {
    typeOf: 'postOrder',
    formData: {
      id: 'cbekrj3buib4b3bsd',
      email: 'sample6@gmail.com',
      amount: 1700,
      date: date
    }
  }
]

export const InvoiceTypes = {
  OPENHOUSE: 'openHouse',
  POSTORDER: 'postOrder',
}

function Invoices() {

  const navigate = useNavigate()
  const [filteredInvoices, setFilteredInvoices] = useState(InvoiceData)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function handleInvoice(data) {
    navigate('/invoiceDownload', { state: data })
  }

  //? ----------------
  //? filter for bulk downloads
  //? ----------------
  function handleFilter() {
    return InvoiceData.filter((data) => 
      {
        const invoiceDate = new Date(data.formData.date);
        return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
      }
    )
  }

  //? ----------------
  //? bulk downloads
  //? ----------------
  function handleAllinvoice() {
    if(!startDate || !endDate){
      return toast.error('select range')
    }
    const filtered = handleFilter()
    if(filtered.length === 0){
      return toast.error('no invoices found')
    }
    filteredInvoices.forEach((data, index) => {
      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);

      // Render the appropriate component based on the invoice type
      if (data.typeOf === InvoiceTypes.OPENHOUSE) {
        const element = (
          <OpenHouseInvoice data={data} />
        );
        ReactDOM.render(element, container);
      } else if (data.typeOf === InvoiceTypes.POSTORDER) {
        const element = (
          <PostOrderInvoice data={data} />
        );
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
        .catch((error) => console.error('PDF Generation Error:', error));
    });
  }

  

  return (
    <>

      <div className="invoices bg-[#f5f5f5] rounded-[20px] w-full h-full overflow-y-scroll px-10 py-5 flex flex-col gap-4">
        <div className="flex gap-4 mb-4">
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
          <button onClick={handleAllinvoice} >Download All</button>
        </div>
        <div className="inoice-top text-center grid grid-cols-3 w-full p-4 border-[1px] rounded-2xl ">
          <div>id</div>
          <div>amount</div>
          <div>Email</div>
        </div>
        <div className="inoice-bottom w-full">
          {InvoiceData.map((data, index) => (
            <button onClick={() => handleInvoice(data)} key={index} className='grid grid-cols-3 w-full py-5 bg-white border-b-[1px]'>
              <div>{data.formData.id}</div>
              <div>{data.formData.email}</div>
              <div> {data.formData.amount} </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default Invoices