import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProppedUpLogo() {

    const navigate = useNavigate()

    return (
        <>
            <button onClick={()=>navigate('/')} className="fixed flex top-0 md:left-0 py-6 px-8 bg-transparent">
                <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
                <div className="text-2xl text-[26.3px] poppinns-font font-semibold text-black">Propped up</div>
            </button>
        </>
    )
}

export default ProppedUpLogo