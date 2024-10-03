import React from "react";

function InputDate({labelText, formDataText, formData, handleInputChange}) {
  return (
    <>
      <div className="flex flex-col">
        <label className="font-medium text-sm">
          {labelText} <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name={formDataText}
          value={formData}
          onChange={handleInputChange}
          required
          className="border border-gray-300 p-2 rounded"
        />
      </div>
    </>
  );
}

export default InputDate;
