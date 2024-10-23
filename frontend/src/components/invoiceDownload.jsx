import React, { useEffect } from 'react'
import { InvoiceTypes } from './Invoices'
import OpenHouseInvoice from './invoices/openHouseInvoice'
import { useLocation, useParams } from 'react-router-dom'
import PostOrderInvoice from './invoices/postOrderInvoice'
import html2pdf from 'html2pdf.js'
import toast from 'react-hot-toast'

function InvoiceDownload({InvoiceData}) {

  // const location = useLocation()
  // const InvoiceData = location.state
  // console.log(InvoiceData)

  var opt = {
    margin: 1,
    filename: 'invoice.pdf',
  }

  function handlesave(type) {
    // console.log('type : ',type)
    const pdf = document.getElementById(type)
    var worker = html2pdf().from(pdf).set(opt).save().then(() => (toast.success('done')))
    console.log('worker : ', worker)
    // html2pdf(pdf)
  }

  useEffect(()=>{}, [InvoiceData])

  if(!InvoiceData) return(
    <>loading ...</>
  )
  return (
    <>
      <div className="invoice-page flex flex-col gap-6 items-center ">
        <div className="inpage-top">
          {InvoiceData.typeOf === InvoiceTypes.OPENHOUSE && <OpenHouseInvoice data={InvoiceData} />}
          {InvoiceData.typeOf === InvoiceTypes.POSTORDER && <PostOrderInvoice data={InvoiceData} />}
        </div>
        <div className="inpage-bottom max-w-[790px] flex justify-end w-full">
          <button className='py-2 px-5 border-[1px] border-[#00B087] text-[#00B087] rounded-lg' onClick={() => handlesave(InvoiceData.typeOf)} >Downlaod Invoice</button>
        </div>
      </div>
    </>
  )
}

export default InvoiceDownload