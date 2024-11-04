import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { UseGlobal } from '../context/GlobalContext'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function ChangeStatusModal({open, setOpen, order, setOrders, setFilteredOrders, setCompleteOrder }) {

  const {baseUrl} = UseGlobal()
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(status){
    setLoading(true)
    try {
      const res = await axios.patch(`${baseUrl}/api/orders/change-status`, {status , orderId : order._id, orderType : order.type }, {withCredentials: true})
      if(res.status !== 200){
        toast.error(res.data.msg || 'Error updating status. Please try again')
      }else{
        toast.success('status updated successfully', {position:'top-right'})
        setOrders( prev => prev.map((o)=> o._id === order._id ? {...o , status} : o )  )
        setFilteredOrders( prev => prev.map((o)=> o._id === order._id ? {...o , status} : o )  )
        setCompleteOrder(prev => ({...prev, status}))
      }
    } catch (error) {
      toast.error('Server Error. Please try again')
    }finally{
      setLoading(false)
      setOpen(false)
    }
  }

  useEffect(()=>{
   console.log('vhjdbfhvjcbdj',order)
  }, [order])

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className='flex flex-col py-4 justify-center w-full items-center gap-3'>
              <div className='font-semibold text-lg text-center'>Change order status</div>
              <div className='flex flex-col w-1/2 '>
                 <button disabled={loading} onClick={()=>handleStatusChange('pending')} className='py-2 hover:bg-gray-300 hover:text-black' >Pending</button>
                 <button disabled={loading} onClick={()=>handleStatusChange('completed')} className='py-2 hover:bg-gray-300 hover:text-black' >Completed</button>
                 <button disabled={loading} onClick={()=>handleStatusChange('installed')} className='py-2 hover:bg-gray-300 hover:text-black' >Installed</button>
                 { order?.type === 'postOrder' && <button disabled={loading} onClick={()=>handleStatusChange('removed')} className='py-2 hover:bg-gray-300 hover:text-black' >Removed</button>}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
