import React, { useEffect, useState } from "react";
import { zones } from "../data/staticData";
import axios from "axios";
import toast from "react-hot-toast";
import { UseGlobal } from "../context/GlobalContext";
import DatePickerDemo from "@/components/ui/DatePicker";

const OpenHouseForm = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    requestedDate: "",
    firstEventStartTime: "",
    firstEventEndTime: "",
    firstEventAddress: {
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
      resetPrice: 0,
    },
    pickSign: false,
    additionalSignQuantity: 0,
    twilightTourSlot: "",
    printAddressSign: false,
    printAddress: {
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    additionalInstructions: "",
    total: 0,
  };

  const additionalPrices = {
    signReset: 5,
    AddressPrint: 10,
    TwilightHour: 25,
    RushFee: 25,
  };

  const [formData, setFormData] = useState(initialState);
  const [rushFee, setRushFee] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().getHours());
  const [loading, setLoading] = useState(false);
  const { baseUrl } = UseGlobal();

  // ----------------------------------
  // handling inputs
  //  ---------------------------------
  const handleInputChange = (input) => {
    if (input instanceof Date) {
      // For the Calendar component
      const value = input.toISOString().split("T")[0]; // Format as yyyy-MM-dd
      setFormData({
        ...formData,
        requestedDate: value,
      });
      checkRushFee(value);
    } else if (input.target) {
      // For standard input elements
      const { name, value } = input.target;
      setFormData({
        ...formData,
        [name]: value,
      });
      if (name === "requestedDate") {
        checkRushFee(value);
      }
    }
  };
  

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
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

  // ----------------------------------
  // rush fee according to day
  //  ---------------------------------
  const checkRushFee = (selectedDate) => {
    const currentDate = new Date();
    const eventDate = new Date(selectedDate);
    console.log("eventDate : ", eventDate);
    const isToday = currentDate.toDateString() === eventDate.toDateString();

    let applyRushFee = false;

    // Helper function to check if the event is within the same week as today
    const isSameWeek = (date) => {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return date >= startOfWeek && date <= endOfWeek;
    };

    if (isSameWeek(eventDate)) {
      // ordering on friday after 4pm for friday, saturday, sunday
      if (currentDate.getDay() == 5 && currentTime >= 16) {
        if (
          eventDate.getDay() === 5 ||
          eventDate.getDay() === 6 ||
          eventDate.getDay() === 0
        ) {
          applyRushFee = true;
        }
      }

      // ordering on saturday at anty time for saturday, sunday
      if (currentDate.getDay() == 6 ) {
        if (eventDate.getDay() === 6 || eventDate.getDay() === 0) {
          applyRushFee = true;
        }
      }

      // ordering on sunday at any time for sunday
      if (currentDate.getDay() == 0  && isToday) {
        applyRushFee = true;
      }
    }

    console.log("week : ", isSameWeek(eventDate));

    setRushFee(applyRushFee ? additionalPrices.RushFee : 0);
  };

  // ----------------------------------
  // updating timer check for loopholes
  //  ---------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getHours());
    }, 1000 * 30);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (formData.requestedDate) {
      checkRushFee(formData.requestedDate);
    }
  }, [currentTime, formData.requestedDate]);

  // ----------------------------------
  // calculating total price
  //  ---------------------------------
  function handleTotal() {
    let newTotal = formData.requiredZone.price + rushFee;
    if (formData.pickSign) newTotal += formData.requiredZone.resetPrice;
    if (formData.additionalSignQuantity > 0)
      newTotal += additionalPrices.signReset * formData.additionalSignQuantity;
    if (formData.printAddressSign)
      newTotal +=
        additionalPrices.AddressPrint * formData.additionalSignQuantity;
    if (
      formData.twilightTourSlot === "slot1" ||
      formData.twilightTourSlot === "slot2"
    )
      newTotal += additionalPrices.TwilightHour;
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
    formData.pickSign,
    formData.additionalSignQuantity,
    formData.printAddressSign,
    formData.twilightTourSlot,
    rushFee,
    currentTime,
  ]);

  //? ----------------------------------
  //? form submission
  //?  ---------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = { ...formData, type: "openHouse" };
    try {
      // Step 1: Verifying payment by creating a checkout session
      const payment = await axios.post(
        `${baseUrl}/api/orders/open-house/create-checkout-session`,
        { total: formData.total },
        {withCredentials : true, validateStatus : (status) => status < 500 }
      );

      if(payment.status !== 200 ){
        toast.error(payment.data.msg || 'Error creating checkout session')
        return
      }

      // Store order data in sessionStorage
      sessionStorage.setItem("orderData", JSON.stringify(data));

      // Step 2: Redirect to the Stripe checkout session
      window.location.href = payment.data.url;

    } catch (error) {
      toast.error("Server Error");
      setLoading(false)
    }
  }

  //? ----------------------------------
  //? updating render
  //?  ---------------------------------
  useEffect(() => {console.log(formData)}, [formData]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="open-house-form h-full m-5 px-12 gap-3 flex flex-col space-y-3 "
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
              className="border border-gray-300 p-2 rounded-sm"
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
              className="border border-gray-300 p-2 rounded-sm"
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
            className="border border-gray-300 p-2 rounded-sm"
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
            className="border border-gray-300 p-2 rounded-sm"
          />
          <span className="text-xs text-gray-500">
            Please enter a valid phone number.
          </span>
        </div>

        {/* Date of First Event Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Date of First Event <span className="text-red-500">*</span>
          </label>
          {/* <input
            type="date"
            name="requestedDate"
            value={formData.requestedDate}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 rounded-sm"
          /> */}
          <div className="pb-1" >
          <DatePickerDemo date={formData.requestedDate} selectedDate={handleInputChange} />
          </div>
          <span className="text-xs text-gray-500">
            $25 Rush fee gets applied for same day orders and orders on Friday
            after 4 pm
          </span>
          {rushFee > 0 && (
            <span className="text-xs text-red-500 mt-1">
              Rush fee of ${rushFee} has been applied.
            </span>
          )}
        </div>

        {/* Time of First Event and End Time Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-sm">
              Time of First Event <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="firstEventStartTime"
              value={formData.firstEventStartTime}
              onChange={handleInputChange}
              required
              className="border border-gray-300 p-2 rounded-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-sm">
              End Time of Event <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="firstEventEndTime"
              value={formData.firstEventEndTime}
              onChange={handleInputChange}
              required
              className="border border-gray-300 p-2 rounded-sm"
            />
          </div>
        </div>

        {/* Event Address Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Event Address (First Event) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={formData.firstEventAddress.streetAddress}
            onChange={(e) => handleAddressChange(e, "firstEventAddress")}
            required
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <input
            type="text"
            name="streetAddress2"
            placeholder="Street Address Line 2"
            value={formData.firstEventAddress.streetAddress2}
            onChange={(e) => handleAddressChange(e, "firstEventAddress")}
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.firstEventAddress.city}
              onChange={(e) => handleAddressChange(e, "firstEventAddress")}
              required
              className="border border-gray-300 p-2 rounded-sm"
            />
            <input
              type="text"
              name="state"
              placeholder="State / Province"
              value={formData.firstEventAddress.state}
              onChange={(e) => handleAddressChange(e, "firstEventAddress")}
              required
              className="border border-gray-300 p-2 rounded-sm"
            />
          </div>
          <input
            type="number"
            name="postalCode"
            placeholder="Postal / Zip Code"
            value={formData.firstEventAddress.postalCode}
            onChange={(e) => handleAddressChange(e, "firstEventAddress")}
            required
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
            className="border border-gray-300 p-2 rounded-sm"
          >
            <option value="">Please Select</option>
            {zones.map((data, index) => (
              <option key={index} value={index}>
                {data.text}
              </option>
            ))}
          </select>
        </div>

        {/* additional info on Required Zone Section */}
        {formData.requiredZone.name !== "" && (
          <div className="flex items-start gap-2 flex-col">
            <label className="font-medium text-sm">
              {formData.requiredZone.name} Sign pickup and re-setup
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="pickSign"
                checked={formData.pickSign}
                onChange={handleCheckboxChange}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">
                Yes, I would like the signs to be picked up and re-set at the
                conclusion of each day for an additional $
                {formData.requiredZone.resetPrice} charge
              </span>
            </div>
            <div className="pt-4">
              *Re-Set fee is only applicable if signs are being picked up and
              placed out again the next morning. Please do not click this button
              if your open house is only one day or if you want the signs left
              out overnight
            </div>
          </div>
        )}

        {/* Additional Sign Quantity Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            No. of Additional Sign Quantity ($5 per sign)
          </label>
          <input
            type="number"
            name="additionalSignQuantity"
            value={formData.additionalSignQuantity}
            onChange={handleInputChange}
            min="0"
            className="border border-gray-300 p-2 rounded-sm"
          />
        </div>

        {/* print on Additional Sign */}
        <div className="flex items-start gap-2 flex-col">
          <label className="font-medium text-sm">
            Address print on each sign
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="printAddressSign"
              checked={formData.printAddressSign}
              onChange={handleCheckboxChange}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">
              Do you need the address printed on each sign? Requires 48 hours
              notice with $10 additional charge.
            </span>
          </div>
        </div>

        {/* Twilight Tours Section */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-sm">
            Twilight Tours - $25 (This is to be added to the regular price of
            open house signs any time there’s a broker tour){" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <input
              type="radio"
              name="twilightTourSlot"
              value="slot1"
              checked={formData.twilightTourSlot === "slot1"}
              onChange={handleInputChange}
              required
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">
              Slot 1 - 5 p.m. - 7 p.m.
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="twilightTourSlot"
              value="slot2"
              checked={formData.twilightTourSlot === "slot2"}
              onChange={handleInputChange}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">
              Slot 2 - 6 p.m. - 8 p.m.
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="twilightTourSlot"
              value="notOpting"
              checked={formData.twilightTourSlot === "notOpting"}
              onChange={handleInputChange}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">
              Not opting for twilight tours
            </span>
          </div>
        </div>

        {/* Print Address Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Address to be printed <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={formData.printAddress.streetAddress}
            onChange={(e) => handleAddressChange(e, "printAddress")}
            required
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <input
            type="text"
            name="streetAddress2"
            placeholder="Street Address Line 2"
            value={formData.printAddress.streetAddress2}
            onChange={(e) => handleAddressChange(e, "printAddress")}
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.printAddress.city}
              onChange={(e) => handleAddressChange(e, "printAddress")}
              required
              className="border border-gray-300 p-2 rounded-sm"
            />
            <input
              type="text"
              name="state"
              placeholder="State / Province"
              value={formData.printAddress.state}
              onChange={(e) => handleAddressChange(e, "printAddress")}
              required
              className="border border-gray-300 p-2 rounded-sm"
            />
          </div>
          <input
            type="number"
            name="postalCode"
            placeholder="Postal / Zip Code"
            value={formData.printAddress.postalCode}
            onChange={(e) => handleAddressChange(e, "printAddress")}
            required
            className="border border-gray-300 p-2 rounded mt-2"
          />
        </div>

        {/* Additional Instructions Section */}
        <div className="flex flex-col">
          <label className="font-medium text-sm">Additional Instructions</label>
          <textarea
            name="additionalInstructions"
            value={formData.additionalInstructions}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded-sm"
          ></textarea>
        </div>

        {/* Total Section */}
        <div className="flex flex-col text-center">
          <label className="font-medium text-xl">
            Total: ${formData.total}
          </label>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
        >
          {loading ? "placing order..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default OpenHouseForm;
