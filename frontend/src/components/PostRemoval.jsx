import React, { useEffect, useState } from 'react'
import { parseDate } from '../helpers/utilities'
import { UseGlobal } from '../context/GlobalContext'
import OrderInfo from './OrderInfo'

function PostRemoval({ postOrders, setPostOrders }) {

    const { setBreadCrumb, isInfo, setIsInfo } = UseGlobal()
    const [completeOrder, setCompleteOrder] = useState('')


    //? --------------------
    //? user click
    //?---------------------
    function handleUserClick(index) {
        const slectedOrder = postOrders[index]
        if (slectedOrder) {
            setCompleteOrder(postOrders[index])
            setBreadCrumb("Order details"); //updating breadcrumb
            setIsInfo(true); //changing view
        }
    }

    useEffect(() => { }, [completeOrder, setPostOrders])

    return (
        <>
            {!isInfo ?
                <div className="post-removal h-full bg-white gap-3 flex flex-col space-y-6 overflow-y-auto ">
                    <div className="removal-head w-full text-xl font-semibold text-center">
                        Cancel Your active subscriptions
                    </div>
                    <div className="removal-body flex flex-col justify-center w-full ">
                        <div className="grid grid-cols-5 text-[#718096] p-5 gap-2 w-full">
                            <div>Order No.</div>
                            <div>Name</div>
                            <div>Email</div>
                            <div>Total</div>
                            <div>Order date</div>
                        </div>
                        {postOrders.length > 0 ?
                            postOrders.map((order, index) => (
                                <>
                                    <button onClick={() => handleUserClick(index)} key={order._id} className="removal grid grid-cols-5 p-5 gap-2 w-full text-left ">
                                        <div className='overflow-hidden'>{order._id}</div>
                                        <div className='overflow-hidden'>{order.firstName} {order.lastName}</div>
                                        <div className='overflow-hidden'>{order.email}</div>
                                        <div className='overflow-hidden'>{order.total}</div>
                                        <div className='overflow-hidden'>{parseDate(order.createdAt)}</div>
                                    </button>
                                </>
                            ))
                            : `You don't have any active subscriptions`}
                    </div>
                </div>

                :

                <OrderInfo order={completeOrder} postOrders={postOrders} setPostOrders={setPostOrders} />

            }
        </>
    )
}

export default PostRemoval