import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ChangeStatusModal({open, setOpen, orderSatus}) {

  function handleStatusChange(status){
    toast.success('status updated successfully', {position:'top-right'})
    setOpen(false)
  }

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
            <div className='flex flex-col py-6'>
            <button onClick={()=>handleStatusChange('pending')} className='py-2 hover:bg-gray-300 hover:text-black' >Pending</button>
            <button onClick={()=>handleStatusChange('completed')} className='py-2 hover:bg-gray-300 hover:text-black' >completed</button>
            <button onClick={()=>handleStatusChange('installed')} className='py-2 hover:bg-gray-300 hover:text-black' >installed</button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
