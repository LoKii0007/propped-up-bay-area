import React, { useState } from 'react'
import OpenhousePricing from './OpenhousePricing'
import PostOrderPricing from './PostOrderPricing'

const PricingList = () => {
  const [activePricing, setActivePricing] = useState('openHouse');

  return (
    <>
      <div className="pricing flex flex-col rounded-md gap-2 py-5">
        <div className="pricing-top grid grid-cols-2 mx-10 px-2 sticky top-[-13px] md:static md:top-0 ">
          <button
            onClick={() => setActivePricing("openHouse")}
            className={` ${
              activePricing === "openHouse" ? "bg-[#34CAA5] text-white " : 'text-[#A1A1A1] bg-[#D9D9D9] '
            } py-6 rounded-l-lg text-2xl font-bold `}
          >
            Open House Order
          </button>
          <button
            onClick={() => setActivePricing("postOrder")}
            className={` ${
              activePricing === "postOrder" ? "bg-[#34CAA5] text-white" : 'text-[#A1A1A1] bg-[#D9D9D9]'
            } py-6 rounded-r-lg text-2xl font-bold`}
          >
            Post Order
          </button>
        </div>
        <div className="order-bottom pb-[80px] md:pb-0 ">
          {activePricing === "openHouse" && <OpenhousePricing />}
          {activePricing === "postOrder" && <PostOrderPricing />  }
        </div>
      </div>
    </>
  )
}

export default PricingList