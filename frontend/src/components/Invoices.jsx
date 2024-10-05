import React from 'react'
import html2pdf from 'html2pdf.js'
import OpenHouseInvoice from './invoices/openHouseInvoice'
import toast from 'react-hot-toast'
import PostOrderInvoice from './invoices/postOrderInvoice'
import  { useNavigate } from 'react-router-dom'

const InvoiceData = [
  {
    typeOf: 'openHouse',
    formData: {
        id : 'sjhcbsjhbdcjs',
        email : 'sample@gmail.com',
        amount :  1000,
    }
  },
  {
    typeOf: 'postOrder',
    formData: {
      id : 'cbekrj3buib4b3bsd',
      email : 'sample6@gmail.com',
      amount :  1700,
    }
  }
]

export const InvoiceTypes = {
  OPENHOUSE : 'openHouse',
  POSTORDER  : 'postOrder',
}

function Invoices() {

  const navigate = useNavigate()

  function handlesave() {
    // const Pdf = document.getElementById('openHousePdf')
    const pdf = document.getElementById('postOrderPdf')
    if (pdf) {
      html2pdf(pdf)
    } else {
      toast.error('file not found')
    }
  }

  function handleInvoice(data){
    navigate('/invoiceDownload', {state : data})
  }

  return (
    <>

      <div className="invoices bg-[#f5f5f5] rounded-[20px] w-full h-full overflow-y-scroll px-10 py-5 flex flex-col gap-4">
        <div className="inoice-top text-center grid grid-cols-3 w-full p-4 border-[1px] rounded-2xl ">
          <div>id</div>
          <div>amount</div>
          <div>Email</div>
        </div>
        <div className="inoice-bottom w-full">
          {InvoiceData.map((data, index) => (
            <button onClick={()=>handleInvoice(data)} key={index} className='grid grid-cols-3 w-full py-5 bg-white border-b-[1px]'>
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