import React, { useEffect } from "react";

const PriceInput = ({ editAdditionalPrices, loading2, selectedAdditionalPrice, updateAdditionalPrices, price, setAdditionalPrices, additionalPrices }) => {
  
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
              disabled={!editAdditionalPrices || selectedAdditionalPrice !== price._id}
              className="border-0 focus:outline-none w-full"
              type="number"
              placeholder={price.name}
              value={price.price}
              onChange={(e) => setAdditionalPrices(prev => prev.map(p => p._id === price._id ? {...p, price: e.target.value} : p))}
            />
          </div>
          <button
            onClick={() => updateAdditionalPrices(price._id, price.name)}
            disabled={loading2}
            className="border-2 border-[#34CAA5] px-6 py-2 rounded-md"
          >
            { loading2 && selectedAdditionalPrice === price._id ? "Saving..." : editAdditionalPrices && selectedAdditionalPrice === price._id ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PriceInput;
