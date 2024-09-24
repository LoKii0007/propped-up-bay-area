import React from "react";

function InputAddress({formData, handleAddressChange, labelText, formDataText}) {

  return (
    <>
      <div className="flex flex-col">
        <label className="font-medium text-sm">
          {labelText}
        </label>
        <input
          type="text"
          name="streetAddress"
          placeholder="Street Address"
          value={formData.streetAddress}
          onChange={(e) => handleAddressChange(e, formDataText )}
          className="border border-gray-300 p-2 rounded"
        />
        <input
          type="text"
          name="streetAddress2"
          placeholder="Street Address Line 2"
          value={formData.streetAddress2}
          onChange={(e) => handleAddressChange(e, formDataText)}
          className="border border-gray-300 p-2 rounded mt-2"
        />
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleAddressChange(e, formDataText)}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State / Province"
            value={formData.state}
            onChange={(e) => handleAddressChange(e, formDataText)}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <input
          type="text"
          name="postalCode"
          placeholder="Postal / Zip Code"
          value={formData.postalCode}
          onChange={(e) => handleAddressChange(e, formDataText)}
          className="border border-gray-300 p-2 rounded mt-2"
        />
      </div>
    </>
  );
}

export default InputAddress;
