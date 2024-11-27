import React from 'react'

const NavbarTop = () => {
    return (
        <>
            <div className='flex md:hidden w-full items-center p-5 justify-between'>
                <button className="flex gap-1 items-center">
                    <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
                    <div className="text-xl font-semibold text-black">Propped up</div>
                </button>
            </div>
        </>
    )
}

export default NavbarTop