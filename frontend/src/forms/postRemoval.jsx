import React, { useState, useEffect } from "react";
import InputAddress from "../ui/inputAddress";
import InputDate from "../ui/inputDate";

function PostRemoval() {
  const [formData, setFormData] = useState({
    agentFirstName: "",
    agentLastName: "",
    email: "",
    neededByDate: "",
    propertyAddress: {
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    additionalInstructions: ""
  });


  // ----------------------------------
  // handling inputs
  //  ---------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [addressType]: {
        ...formData[addressType],
        [name]: value,
      },
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="open-house-form h-full bg-white shadow-md rounded-lg mx-5 gap-3 p-10 flex flex-col space-y-6 overflow-y-scroll"
      >
        {/* Name Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-sm">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="agentFirstName"
              value={formData.agentFirstName}
              onChange={handleInputChange}
              required
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-sm">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="agentLastName"
              value={formData.agentLastName}
              onChange={handleInputChange}
              required
              className="border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        {/* Email Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 rounded"
          />
        </div>

        {/*property Address Section */}
        <InputAddress
          formDataText="propertyAddress"
          labelText="Property Address"
          formData={formData.propertyAddress}
          handleAddressChange={handleAddressChange}
        />

        {/* Date nedded Section */}
        <InputDate formData={formData.neededByDate} labelText={"Needed By Date"} formDataText={"neededByDate"} handleInputChange={handleInputChange} />

        {/* Additional Instructions Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">Additional Instructions</label>
          <textarea
            name="additionalInstructions"
            value={formData.additionalInstructions}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default PostRemoval;
