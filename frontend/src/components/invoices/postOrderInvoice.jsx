import React from "react";

function PostOrderInvoice({ data }) {
  return (
    <>
      <div
        id="postOrder"
        className="max-w-[790px] mx-auto bg-[fff] border border-[#d1d5db] min-w-[700px] "
      >
        <div className="bg-[#166534] text-white flex py-4 px-10 justify-between">
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <h2 className="text-lg">{`PRB${String(data?.orderNo).padStart(
            5,
            "0"
          )}`}</h2>
        </div>
        <div className="p-8 pt-0">
          <div className="flex justify-between mt-4">
            <div>
              <p>Received:</p>
              <p>{new Date(data.requestedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-bold pb-3">Propped Up Sign Services</p>
              <p>123 Company Address St.</p> <p>info@proppedupbayarea.com</p>
            </div>
          </div>
          <h3 className="text-center text-xl font-bold my-4">
            POST ORDER FORM
          </h3>
          <div className="border-t border-[#d1d5db] my-4"></div>
          <h3 className="text-lg font-semibold mb-4">
            {data.firstName} {data.lastName}
          </h3>

          <div className="font-semibold mb-1">Listing address</div>
          <div className="mb-4">
            <p>{data.listingAddress.streetAddress}</p>
            <p>{data.listingAddress?.streetAddress2}</p>
            <p>
              {data.listingAddress.city}, {data.listingAddress.state},{" "}
              {data.listingAddress.postalCode}
            </p>
          </div>

          <div className="font-semibold mb-1">Billing address</div>
          <div className="mb-4">
            <p>{data.billingAddress?.streetAddress}</p>
            <p>{data.billingAddress?.streetAddress2}</p>
            <p>
              {data.billingAddress?.city}, {data.billingAddress?.state},{" "}
              {data.billingAddress?.postalCode}
            </p>
          </div>
          <div className="mb-1 flex gap-8">
            <span className="font-semibold">First payment: </span>$
            {data.requiredZone.price}
          </div>
          <div className="mb-4 flex gap-8">
            <span className="font-semibold">Renewal Fee: </span>$
            {data.subscrptionFee}
          </div>
          <div className="mb-4 flex gap-8 ">
            <h4 className="font-semibold">
              What color would you like your post?
            </h4>
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
            <h4 className="font-semibold">Riders</h4>
            <ul className="list-disc pl-5">
              <li>
                <span className="font-semibold">Coming soon:</span>{" "}
                {data.riders?.comingSoon || 0}
              </li>
              <li>
                <span className="font-semibold">Pending:</span>{" "}
                {data.riders?.pending || 0}
              </li>
              <li>
                <span className="font-semibold">Open Saturday & Sunday:</span>{" "}
                {data.riders?.openSatSun || 0}
              </li>
              <li>
                <span className="font-semibold">Do not disturb:</span>{" "}
                {data.riders?.doNotDisturb || 0}
              </li>
              <li>
                <span className="font-semibold">Pool:</span>{" "}
                {data.riders?.pool || 0}
              </li>
            </ul>
          </div>
          <div className="border-t border-[#d1d5db] my-4"></div>

          <div className="mb-4 flex gap-4 ">
            <h4 className="font-semibold">Additional Instructions</h4>
            <p>
              {data.additionalInstructions ||
                "No additional instructions provided."}
            </p>
          </div>
          <div className="border-t border-[#d1d5db] my-4"></div>

          <div className="mb-4">
            <p>
              Post signs is based on zones for first payment and a $
              {data?.subsriptionFee} monthly recurring fee which will be removed
              during the post order removal request submission.
            </p>
          </div>
          <div className="mt-6">
            <p className="font-bold">THANK YOU</p>
          </div>
          <div className="my-4">
            <img src="/logo.png" alt="Company Logo" />
          </div>
        </div>
      </div>
    </>
  );
}

export default PostOrderInvoice;
