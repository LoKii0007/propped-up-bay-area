import React from 'react';

const OpenHouseInvoice = () => {
    return (
        <div id='openHousePdf' className="max-w-[790px] mx-auto bg-white border border-gray-300">
            <div className="bg-green-800 text-white flex py-4 px-10 justify-between">
                <h1 className="text-2xl font-bold">INVOICE</h1>
                <h2 className="text-lg">PSS001028</h2>
            </div>

            <div className='p-8 pt-0' >
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
                <h3 className="text-center text-xl font-bold my-4">OPEN HOUSE SIGN ORDER FORM</h3>
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between gap-4">
                    <div>
                        <h4 className="font-bold">HERMAN CHAN</h4>
                        <p>Date of First Event: Wednesday, October 9, 2024</p>
                        <p>Please select your required zone (1 event, includes up to 6 signs):</p>
                        <p>Zone 2: San Francisco -$95</p>
                        <p>Time of First event: 05:00 PM</p>
                        <p>Event address (First event):</p>
                        <p>241 Paris, San Francisco, CA, 94112</p>
                    </div>
                    <div className="text-right">
                        <div className="border-t border-gray-300 my-4"></div>

                        <div className='flex justify-between'>
                            <h4 className="font-bold">Total</h4>
                            <span className="font-bold">120.00 USD</span>
                        </div>
                        <div className="border-t border-gray-300 my-2"></div>

                        <div className='text-left' >
                            <h4 className="font-bold ">Payer Information</h4>
                            <p>HERMAN CHAN</p>
                            <p>hermankchan@gmail.com</p>
                            <div className="border-t border-gray-300 my-2"></div>

                            <h4 className='font-bold' >Transaction ID</h4>
                            <p> pi_3Q63GtKIHofgmedU0HKo5hgA</p>
                            <div className="border-t border-gray-300 my-2"></div>
                            <h4 className='font-bold' >Payment Method</h4>
                            <p>Apple Pay</p>
                            <div className="border-t border-gray-300 my-2"></div>

                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-300 my-4"></div>
                <div>
                    <h4 className="font-bold">Additional Information</h4>
                    <p>Address print on each sign</p>
                    <p>Additional sign Quantity ($5 per sign)</p>
                    <p>Twilight Tours (Additional $25 charges)</p>
                    <p>Slot 1 - 5 p.m. - 7 p.m.</p>
                    <p>Rush fee: 0</p>
                </div>
                <div className="border-t border-gray-300 my-4"></div>
                <div className='my-4 font-bold ' >
                    THANK YOU
                </div>
                <div className='border-b-2 border-black w-full' ></div>
                <div className='my-4'>
                    <img src="/logo.png" alt="" />
                </div>
            </div>
        </div>
    );
};

export default OpenHouseInvoice;
