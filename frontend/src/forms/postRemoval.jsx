import React, { useState, useEffect } from "react"

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      propertyAddress: {
        ...formData.propertyAddress,
        [name]: value,
      },
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(formData)

  }

  return (
    <>
      <form
        id="pdf"
        onSubmit={handleSubmit}
        className="post-removal-form h-full bg-white mx-5 gap-3 p-10 flex flex-col space-y-6 overflow-y-scroll"
      >
        {/* Name Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-sm ">
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
        <div className="flex flex-col">
          <label className="font-medium text-sm">Property Address</label>
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={formData.propertyAddress.streetAddress}
            onChange={handleAddressChange}
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <input
            type="text"
            name="streetAddress2"
            placeholder="Street Address Line 2"
            value={formData.propertyAddress.streetAddress2}
            onChange={handleAddressChange}
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.propertyAddress.city}
              onChange={handleAddressChange}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              name="state"
              placeholder="State / Province"
              value={formData.propertyAddress.state}
              onChange={handleAddressChange}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <input
            type="text"
            name="postalCode"
            placeholder="Postal / Zip Code"
            value={formData.propertyAddress.postalCode}
            onChange={handleAddressChange}
            className="border border-gray-300 p-2 rounded mt-2"
          />
        </div>

        {/* Date needed Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">Needed By Date</label>
          <input
            type="date"
            name="neededByDate"
            value={formData.neededByDate}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded"
          />
        </div>

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
