import React, { useEffect } from "react";

const PriceInput = ({ editAdditionalPrices, loading2, selectedAdditionalPrice, updateAdditionalPrices, price }) => {
  
    useEffect(() => {
        console.log(price)
    }, [selectedAdditionalPrice])
  
    return (
    <>
      <div className="rush-fee flex flex-col gap-4 ">
        <h2 className="text-2xl font-bold">{price.name} Charge</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-2 border-[#000000] rounded-md p-2">
            ${" "}
            <input
              disabled={!editAdditionalPrices}
              className="border-0 focus:outline-none w-full"
              type="number"
              placeholder={price.name}
            />
          </div>
          <button
            onClick={() => updateAdditionalPrices(price._id)}
            disabled={loading2}
            className="border-2 border-[#34CAA5] px-6 py-2 rounded-md"
          >
            {editAdditionalPrices && selectedAdditionalPrice ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PriceInput;
