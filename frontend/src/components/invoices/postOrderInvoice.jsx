import React from 'react'

function PostOrderInvoice({data}) {

    console.log('post invoice :', data)

    return (
        <>
            <div id='postOrder' className="max-w-[790px] mx-auto bg-white border border-gray-300">
                <div className="bg-green-800 text-white flex py-4 px-10 justify-between">
                    <h1 className="text-2xl font-bold">INVOICE</h1>
                    <h2 className="text-lg">PSS001028</h2>
                </div>
                <div className='p-8 pt-0'>
                    <div className="flex justify-between mt-4">
                        <div>
                            <p>Received:</p>
                            <p>Friday, October 4, 2024</p>
                        </div>
                        <div>
                            <p className='font-bold pb-3' >Propped Up Sign Services</p>
                            <p>{/* companyAddress */}</p>
                            <p>info@proppedupbayarea.com</p>
                            <p>510.661.3100</p>
                        </div>
                    </div>
                    <h3 className="text-center text-xl font-bold my-4">POST ORDER FORM</h3>
                    <div className="border-t border-gray-300 my-4"></div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Anne Keller</h3>
                        <p>4916 Cochrane Ave.</p>
                        <p>Oakland, CA, 94618</p>
                    </div>
                    <div className="mb-4 flex gap-8">
                        <p className="font-semibold">Subscription: <span className="">$15.00</span></p>
                    </div>
                    <div className="mb-4 flex gap-8 ">
                        <h4 className="font-semibold">What color would you like your post?</h4>
                        <p>White</p>
                    </div>
                    <div className="mb-4 flex gap-8 ">
                        <h4 className="font-semibold">Flyer box</h4>
                        <p>Lighting</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold">Renewal Date: <span className="">May 30 2024</span></p>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-semibold">Status</h4>
                        <ul className="list-disc pl-5">
                            <li>Coming soon: 0</li>
                            <li>Pending: 0</li>
                            <li>Open Saturday & Sunday: 0</li>
                            <li>Do not disturb: 0</li>
                            <li>Pool: 0</li>
                        </ul>
                    </div>
                    <div className="border-t border-gray-300 my-4"></div>

                    <div className="mb-4 flex gap-4 ">
                        <h4 className="font-semibold">Additional Instructions</h4>
                        <p>Please install the post at the curb in front of the property.</p>
                    </div>
                    <div className="border-t border-gray-300 my-4"></div>

                    <div className="mb-4">
                        <p>Post signs start at $50 as first payment and a $15.00 monthly recurring fee which will be removed during the post order removal request submission.</p>
                    </div>
                    <div className=" mt-6">
                        <p className="font-bold">THANK YOU</p>
                    </div>
                    <div className='my-4'>
                        <img src="/logo.png" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostOrderInvoice