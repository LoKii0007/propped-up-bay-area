import React, { useState } from 'react'
import { useGlobal } from '@/context/GlobalContext'

export const Navbar = ({ setActiveView, activeView }) => {

    const [modalOpen, setModalOpen] = useState(false)
    const { setBreadCrumb, isInfo, setIsInfo, breadCrumb } = useGlobal()

    function handleView(data) {
        let view = data.toLowerCase()
        setActiveView(view)
        if (breadCrumb !== view) setBreadCrumb(data)
        if (isInfo) setIsInfo(false)
    }

    return (
        <>
            <nav className='grid grid-cols-4 p-5 fixed bottom-0 z-50 w-full bg-white md:hidden navbar '>
                <div className='flex items-center justify-center gap-2'>
                    <button onClick={() => handleView('Dashboard')} className={` custom-transition flex flex-col items-center justify-center gap-1 py-2 rounded-lg px-5 ${activeView === 'dashboard' ? 'bg-[#638856] text-white font-semibold' : 'text-[#737791] font-medium'}`}>
                        <img src='/svg/dashboard.svg' alt="logo" />
                        <span>Home</span>
                    </button>
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <button onClick={() => handleView('Order')} className={` custom-transition flex flex-col items-center justify-center gap-1 py-2 rounded-lg px-5 ${activeView === 'order' ? 'bg-[#638856] text-white font-semibold' : 'text-[#737791] font-medium'}`}>
                        <img src='/svg/order.svg' alt="logo" />
                        <span>Order</span>
                    </button>
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <button onClick={() => handleView('Removal')} className={` custom-transition flex flex-col items-center justify-center gap-1 py-2 rounded-lg px-5 ${activeView === 'removal' ? 'bg-[#638856] text-white font-semibold' : 'text-[#737791] font-medium'}`}>
                        <img src='/svg/removal.svg' alt="logo" />
                        <span>Removal</span>
                    </button>
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <button onClick={() => handleView('Profile')} className={` custom-transition flex flex-col items-center justify-center gap-1 py-2 rounded-lg px-5 ${activeView === 'profile' ? 'bg-[#638856] text-white font-semibold' : 'text-[#737791] font-medium'}`}>
                        <img src='/svg/settings.svg' alt="logo" />
                        <span>Profile</span>
                    </button>
                </div>

            </nav>
        </>
    )
}
