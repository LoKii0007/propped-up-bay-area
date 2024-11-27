'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import StartDatePicker from '@/components/ui/StartDatePicker'
import EndDatePicker from '@/components/ui/EndDatePicker'

export default function FilterModal({ open, setOpen, setStartDate, setEndDate, startDate, endDate, handleClearFilter, handleOrderStatus, orderStatus, orderType, handleOrderType }) {
  const [tempOrderType, setTempOrderType] = useState(orderType);
  const [tempOrderStatus, setTempOrderStatus] = useState(orderStatus);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  function handleApply() {
    handleOrderType(tempOrderType);
    handleOrderStatus(tempOrderStatus);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setOpen(false);
  }

  function handleReset() {
    handleClearFilter();
    setTempOrderType('all');
    setTempOrderStatus('all');
    setTempStartDate(null);
    setTempEndDate(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-500 data-[leave]:duration-400 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col gap-6 p-6">
              <div className='filter-header flex justify-between items-center'>
                <span className='text-xl font-semibold'>Filters</span>
                <button onClick={() => setOpen(false)} className='text-xl font-semibold'>X</button>
              </div>

              <div className="filter-top w-full flex flex-col gap-4 ">
                <div className="filter-item flex flex-col gap-2 ">
                  <span className='text-md font-semibold'>Order Type</span>
                  <div className='grid grid-cols-2 gap-2' >
                    <button onClick={() => setTempOrderType('all')} className={` ${tempOrderType === 'all' ? "bg-[#638856] text-white" : 'bg-gray-100'
                      } text-center rounded-md text-base  px-3 py-2 dashboard-btn`}>All</button>
                    <button onClick={() => setTempOrderType('postOrder')} className={` ${tempOrderType === 'postOrder' ? "bg-[#638856] text-white" : 'bg-gray-100'
                      } text-center rounded-md text-base px-3 py-2 dashboard-btn`}>Post Order</button>
                    <button onClick={() => setTempOrderType('openhouse')} className={` ${tempOrderType === 'openhouse' ? "bg-[#638856] text-white" : 'bg-gray-100'
                      } text-center rounded-md text-base px-3 py-2 dashboard-btn`}>Openhouse</button>
                  </div>
                </div>
                <div className="filter-item flex flex-col gap-2 ">
                  <span className='text-md font-semibold'>Order Status</span>
                  <div className='grid grid-cols-2 gap-2' >
                    <button onClick={() => setTempOrderStatus('all')} className={` ${tempOrderStatus === 'all' ? "bg-[#638856] text-white" : 'bg-gray-100'
                      } text-center rounded-md text-base px-3 py-2 `}>All </button>
                    <button onClick={() => setTempOrderStatus('pending')} className={` ${tempOrderStatus === 'pending' ? "bg-[#638856] text-white" : 'bg-gray-100'
                      } text-center rounded-md text-base px-3 py-2 `}>Pending</button>
                    <button onClick={() => setTempOrderStatus('completed')} className={` ${tempOrderStatus === 'completed' ? "bg-[#638856] text-white" : 'bg-gray-100'
                      } text-center rounded-md text-base px-3 py-2 `}>Completed</button>
                    <button onClick={() => setTempOrderStatus('removed')} className={` ${tempOrderStatus === 'removed' ? "bg-[#638856] text-white" : 'bg-gray-100'
                      } text-center rounded-md text-base px-3 py-2 `}>Removed</button>
                  </div>
                </div>
                <div className="filter-item flex flex-col gap-2 ">
                  <span className='text-md font-semibold'>Select range</span>
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='w-full bg-gray-100 border border-gray-300 rounded-md'>
                      <StartDatePicker setStartDate={setTempStartDate} startDate={tempStartDate} />
                    </div>
                    <div className='w-full bg-gray-100 border border-gray-300 rounded-md'>
                      <EndDatePicker setEndDate={setTempEndDate} endDate={tempEndDate} />
                    </div>
                  </div>
                </div>
              </div>


              <div className="filter-bottom grid grid-cols-2 gap-2 w-full justify-around">
                <button onClick={() => handleApply()} className='bg-[#638856] text-white px-5 py-2 rounded-md'>Apply</button>
                <button onClick={() => handleReset()} className='border border-[#638856] text-[#638856] px-5 py-2 rounded-md'>Reset</button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
