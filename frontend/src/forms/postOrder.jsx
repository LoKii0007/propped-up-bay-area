import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";
import DatePickerDemo from "@/components/ui/DatePicker";

function PostOrder() {
  const initialState = {
    type: "postOrder",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    requestedDate: "",
    listingAddress: {
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    billingAddress: {
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    requiredZone: {
      name: "",
      text: "",
      price: 0,
    },
    additionalInstructions: "",
    total: 0,
    postColor: "",
    flyerBox: false,
    lighting: false,
    numberOfPosts: 1,
    riders: {
      comingSoon: 0,
      pending: 0,
      openSatSun: 0,
      openSat: 0,
      openSun: 0,
      doNotDisturb: 0,
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { baseUrl, additionalPrices: postOrderPrices, zonePrices } = useGlobal();

  const zones = zonePrices.filter(zone => zone.type === "postOrder");

  const additionalPrices = {
    flyerBox: postOrderPrices.find(price => price.name === "Flyer Box")?.price,
    lighting: postOrderPrices.find(price => price.name === "Lighting")?.price,
    rider: postOrderPrices.find(price => price.name === "Rider")?.price,
    post: postOrderPrices.find(price => price.name === "Post")?.price || 15,
  };

  useEffect(() => {
  }, [ additionalPrices, zones]);

  //? ----------------------------------
  //? handling inputs
  //?  ---------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      requestedDate: date, // This updates the requestedDate in the state
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

  const handleZoneChange = (e) => {
    const selectedIndex = e.target.value;

    if (selectedIndex === "") {
      setFormData({
        ...formData,
        requiredZone: { name: "", text: "", price: 0, resetPrice: 0 },
      });
    } else {
      setFormData({
        ...formData,
        requiredZone: zones[selectedIndex],
      });
    }
  };

  const handleRiderChange = (rider, increment) => {
    setFormData((prev) => ({
      ...prev,
      riders: {
        ...prev.riders,
        [rider]: Math.max(0, prev.riders[rider] + increment),
      },
    }));
  };

  //? ----------------------------------
  //? calculating total price
  //?  ---------------------------------
  function handleTotal() {
    let newTotal = 0;
    if (formData.flyerBox) {
      newTotal += additionalPrices.flyerBox;
    }
    if (formData.lighting) {
      newTotal += additionalPrices.lighting;
    }
    newTotal += formData.numberOfPosts * formData.requiredZone.price;
    newTotal += formData.riders.comingSoon * additionalPrices.rider;
    newTotal += formData.riders.pending * additionalPrices.rider;
    newTotal += formData.riders.openSatSun * additionalPrices.rider;
    newTotal += formData.riders.openSat * additionalPrices.rider;
    newTotal += formData.riders.openSun * additionalPrices.rider;
    newTotal += formData.riders.doNotDisturb * additionalPrices.rider;
    console.log("newtotal", newTotal);
    return newTotal;
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total: handleTotal(),
    }));
  }, [
    formData.requiredZone,
    formData.flyerBox,
    formData.lighting,
    formData.postOrder,
    formData.riders,
    formData.numberOfPosts,
  ]);

  //? ----------------------------------
  //? form submission
  //?  ---------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if(!formData.requestedDate) {
      toast.error("Please select a date for the event");
      setLoading(false);
      return;
    }
    try {
      
      // step1: creating order
      const res = await axios.post(
        `${baseUrl}/api/orders/post-order`,
        formData,
        { withCredentials: true, validateStatus : (status) => status < 500 }
      );

      if (res.status !== 201) {
        setLoading(false);
        toast.error(res.data.msg || "Error creating order");
        return;
      }

      // step2: creating subscription schedule
      const payment = await axios.post(
        `${baseUrl}/api/orders/post-order/subscription-schedule`,
        { data: res.data.order },
        { withCredentials: true, validateStatus: (status) => status < 500 }
      );

      if (payment.status !== 200) {
        setLoading(false);
        toast.error(payment.data.msg || "Error creating checkout session");
        return;
      }

      // step3: Redirect to the Stripe checkout session
      window.location.href = payment.data.url;
    } catch (error) {
      toast.error("Server error. Please try again later.");
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="open-house-form h-full m-5 gap-3 px-12 flex flex-col space-y-6 bg-white"
      >
        {/* Name Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-sm">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
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
              name="lastName"
              value={formData.lastName}
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

        {/* Phone Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="(000) 000-0000"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 rounded"
          />
          <span className="text-xs text-gray-500">
            Please enter a valid phone number.
          </span>
        </div>

        {/* Date needed Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Date needed by <span className="text-red-500">*</span>
          </label>
          <DatePickerDemo
            date={formData.requestedDate}
            selectedDate={handleDateChange}
          />
        </div>

        {/*listing Address Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Listing Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={formData.listingAddress.streetAddress}
            onChange={(e) => handleAddressChange(e, "listingAddress")}
            className="border border-gray-300 p-2 rounded mt-2"
            required
          />
          <input
            type="text"
            name="streetAddress2"
            placeholder="Street Address Line 2"
            value={formData.listingAddress.streetAddress2}
            onChange={(e) => handleAddressChange(e, "listingAddress")}
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.listingAddress.city}
              onChange={(e) => handleAddressChange(e, "listingAddress")}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State / Province"
              value={formData.listingAddress.state}
              onChange={(e) => handleAddressChange(e, "listingAddress")}
              className="border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <input
            type="number"
            name="postalCode"
            placeholder="Postal / Zip Code"
            value={formData.listingAddress.postalCode}
            onChange={(e) => handleAddressChange(e, "listingAddress")}
            className="border border-gray-300 p-2 rounded mt-2"
            required
          />
        </div>

        {/*billing Address Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Billing Address <span className="text-red-500">*</span>{" "}
          </label>
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={formData.billingAddress.streetAddress}
            onChange={(e) => handleAddressChange(e, "billingAddress")}
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <input
            type="text"
            name="streetAddress2"
            placeholder="Street Address Line 2"
            value={formData.billingAddress.streetAddress2}
            onChange={(e) => handleAddressChange(e, "billingAddress")}
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.billingAddress.city}
              onChange={(e) => handleAddressChange(e, "billingAddress")}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              name="state"
              placeholder="State / Province"
              value={formData.billingAddress.state}
              onChange={(e) => handleAddressChange(e, "billingAddress")}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <input
            type="text"
            name="postalCode"
            placeholder="Postal / Zip Code"
            value={formData.billingAddress.postalCode}
            onChange={(e) => handleAddressChange(e, "billingAddress")}
            className="border border-gray-300 p-2 rounded mt-2"
          />
        </div>

        {/* Required Zone Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Please select your required zone (1 event, includes up to 6 signs){" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            name="requiredZone"
            value={
              zones.findIndex(
                (zone) => zone.name === formData.requiredZone.name
              ) !== -1
                ? zones.findIndex(
                  (zone) => zone.name === formData.requiredZone.name
                )
                : ""
            }
            onChange={handleZoneChange}
            required
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Please Select</option>
            {zones.map((data, index) => (
              <option key={index} value={index}>
                {data.text.slice(0, data.text.indexOf("-"))} - ${data.price}
              </option>
            ))}
          </select>
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

        {/* Post Color Section */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">
            What color would you like your post?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4 text-sm ">
            <div className="flex gap-2">
              <input
                type="radio"
                name="postColor"
                value="Black"
                checked={formData.postColor === "Black"}
                onChange={handleInputChange}
                required
                className="h-4 w-4"
              />
              <label>Black</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="postColor"
                value="White"
                checked={formData.postColor === "White"}
                onChange={handleInputChange}
                className="h-4 w-4"
                required
              />
              <label>White</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="postColor"
                value="Grey"
                checked={formData.postColor === "Grey"}
                onChange={handleInputChange}
                required
                className="h-4 w-4"
              />
              <label>Grey</label>
            </div>
          </div>
        </div>

        {/* Flyer Box Section */}
        <div className="flex gap-2">
          <input
            type="checkbox"
            name="flyerBox"
            checked={formData.flyerBox}
            onChange={handleInputChange}
          />
          <label className="font-medium text-sm">
            Yes I would like to add a flyer box for ${additionalPrices.flyerBox} additional
          </label>
        </div>

        {/* Lighting Section */}
        <div className="flex gap-2">
          <input
            type="checkbox"
            name="lighting"
            checked={formData.lighting}
            onChange={handleInputChange}
          />
          <label className="font-medium text-sm">
            Yes I would like to add lighting for ${additionalPrices.lighting} additional
          </label>
        </div>

        {/* Number of Posts Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Number of post's required <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  numberOfPosts: Math.max(0, formData.numberOfPosts - 1),
                })
              }
            >
              -
            </button>
            <input
              type="number"
              name="numberOfPosts"
              value={formData.numberOfPosts}
              onChange={handleInputChange}
              min="0"
              className="border border-gray-300 p-2 rounded"
              required
            />
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  numberOfPosts: formData.numberOfPosts + 1,
                })
              }
            >
              +
            </button>
          </div>
        </div>

        {/* Riders Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">Riders</label>
          <p className="mb-2">
            Each rider costs ${additionalPrices.rider}. Enter the required number.
          </p>
          <hr />
          <div className=" flex flex-col gap-2 w-max pt-4">
            {[
              "comingSoon",
              "pending",
              "openSatSun",
              "openSat",
              "openSun",
              "doNotDisturb",
            ].map((rider) => (
              <div key={rider} className="flex rider-item items-center gap-12">
                <label className="flex-1">
                  {rider
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRiderChange(rider, -1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={formData.riders[rider]}
                    readOnly
                    className="border border-gray-300 p-2 rounded "
                  />
                  <button
                    type="button"
                    onClick={() => handleRiderChange(rider, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Order Section */}
        <div className="flex flex-col md:flex-row gap-2 border border-gray-300 rounded bg-gray-100 items-center justify-between px-4 py-5">
          <div className="flex gap-2 items-center justify-between md:justify-normal w-full md:w-fit ">
            <div className="font-medium text-lg">Postorder</div>
            <div className="font-medium text-md border bg-white border-gray-300 p-2 rounded px-5 ">
              {formData.total}
            </div>
          </div>
          <p>USD for the first month then, ${additionalPrices.post} for each month</p>
        </div>

        {/* Total Section */}
        <div className="w-full items-center flex flex-col gap-4 md:sticky bg-white md:custom-shadow pt-2 md:bottom-[-20px]">
          <div className="flex flex-col text-center">
            <label className="font-medium text-xl">
              Total: ${formData.total}
            </label>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full "
          >
            {loading ? "submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
}

export default PostOrder;
