import React from 'react';

function PostOrderInvoice({ data }) {

    console.log('post invoice :', data);

    return (
        <>
            <div id='postOrder' className="max-w-[790px] mx-auto bg-[fff] border border-[#d1d5db]">
                <div className="bg-[#166534] text-white flex py-4 px-10 justify-between">
                    <h1 className="text-2xl font-bold">INVOICE</h1>
                    <h2 className="text-lg">{`PRB${String(data?.orderNo).padStart(5, '0')}`}</h2>
                </div>
                <div className='p-8 pt-0'>
                    <div className="flex justify-between mt-4">
                        <div>
                            <p>Received:</p>
                            <p>{new Date(data.requestedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className='font-bold pb-3'>Propped Up Sign Services</p>
                            <p>123 Company Address St.</p> {/* Update with the actual address if available */}
                            <p>info@proppedupbayarea.com</p>
                            <p>510.661.3100</p>
                        </div>
                    </div>
                    <h3 className="text-center text-xl font-bold my-4">POST ORDER FORM</h3>
                    <div className="border-t border-[#d1d5db] my-4"></div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">{data.firstName} {data.lastName}</h3>
                        <p>{data.listingAddress.streetAddress}</p>
                        <p>{data.listingAddress.city}, {data.listingAddress.state}, {data.listingAddress.postalCode}</p>
                    </div>
                    <div className="mb-4 flex gap-8">
                        <p className="font-semibold">Subscription: <span>${data.requiredZone.price}</span></p>
                    </div>
                    <div className="mb-4 flex gap-8 ">
                        <h4 className="font-semibold">What color would you like your post?</h4>
                        <p>{data.postColor}</p>
                    </div>
                    <div className="mb-4 flex gap-8 ">
                        <h4 className="font-semibold">Flyer box</h4>
                        <p>{data.flyerBox ? "Included" : "Not Included"}</p>
                    </div>
                    <div className="mb-4 flex gap-8 ">
                        <h4 className="font-semibold">Lighting</h4>
                        <p>{data.lighting ? "Included" : "Not Included"}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold">Renewal Date: <span>May 30, 2024</span></p> {/* Assuming a placeholder or actual renewal date */}
                    </div>
                    <div className="mb-4">
                        <h4 className="font-semibold">Status</h4>
                        <ul className="list-disc pl-5">
                            <li>Coming soon: {data.riders?.comingSoon || 0}</li>
                            <li>Pending: {data.riders?.pending || 0}</li>
                            <li>Open Saturday & Sunday: {data.riders?.openSatSun || 0}</li>
                            <li>Do not disturb: {data.riders?.doNotDisturb || 0}</li>
                            <li>Pool: {data.riders?.pool || 0}</li>
                        </ul>
                    </div>
                    <div className="border-t border-[#d1d5db] my-4"></div>

                    <div className="mb-4 flex gap-4 ">
                        <h4 className="font-semibold">Additional Instructions</h4>
                        <p>{data.additionalInstructions || "No additional instructions provided."}</p>
                    </div>
                    <div className="border-t border-[#d1d5db] my-4"></div>

                    <div className="mb-4">
                        <p>Post signs start at ${data.total} as first payment and a $15.00 monthly recurring fee which will be removed during the post order removal request submission.</p>
                    </div>
                    <div className="mt-6">
                        <p className="font-bold">THANK YOU</p>
                    </div>
                    <div className='my-4'>
                        <img src="/logo.png" alt="Company Logo" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostOrderInvoice;
