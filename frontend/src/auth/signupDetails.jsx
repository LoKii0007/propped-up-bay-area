import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UseGlobal } from "../context/GlobalContext";

const SignUpDetails = () => {
  const initialState = {
    company: "",
    caDreLicense: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    workPhone: "",
    mobilePhone: "",
    receiveEmailNotifications: false,
    receiveTextNotifications: false,
  };

  // const location = useLocation();
  const navigate = useNavigate();
  const {baseUrl} = UseGlobal()

  // const user = location.state;
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //?---------------------------------
  //? form submission
  //?---------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const res = await axios.post(`${baseUrl}/auth/signUp/details`, formData, {
        withCredentials: true,
      });
      if (res.status !== 201) {
        toast.error("something went wrong, try again");
        return;
      }
      toast.success("submitted succesfully. Please login");
      setFormData(initialState); // cleanup of form
      navigate("/login"); // navigating to homepage
    } catch (error) {
      toast.error("something went wrong, try again");
    }
  };

  // useEffect(() => {}, [user]);

  return (
    <div className="max-w-3xl mx-auto p-8 overflow-y-auto ">
      <div className="w-full justify-center items-center flex py-6 px-8 ">
        <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
        <div className="text-2xl text-[26.3px] poppinns-font font-semibold text-black">
          Propped up
        </div>
      </div>

      <h1 className="font-bold text-center">Create a new Account</h1>
      <p className="text-center mb-6">Please complete the form below</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Client Details</h2>

          <div className="grid gap-5">
            <div className="flex w-full items-center gap-4 ">
              <label className="block text-[16px] w-1/3 ">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className=" border border-[#646464] rounded px-3 py-2 w-2/3  "
              />
            </div>

            <div className="flex w-full items-center gap-4 ">
              <label className="block text-[16px] w-1/3 ">CA DRE License</label>
              <input
                type="text"
                name="caDreLicense"
                value={formData.caDreLicense}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex w-full items-center gap-4 ">
              <label className="block text-[16px] w-1/3 ">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex w-full items-center gap-4 ">
              <label className="block text-[16px] w-1/3">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex w-full items-center gap-4 ">
              <label className="block text-[16px] w-1/3">State</label>
              <select
                name="state"
                value={formData.state}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              >
                <option value="">Select a state</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                {/* Add more states as needed */}
              </select>
            </div>

            <div className="flex w-full items-center gap-4 ">
              <label className="block text-[16px] w-1/3">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex w-full items-center gap-4 ">
              <label className="block text-[16px] w-1/3">Work Phone</label>
              <input
                type="text"
                name="workPhone"
                value={formData.workPhone}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex w-full items-center gap-4 ">
              <label className="block text-[16px] w-1/3">Mobile Phone</label>
              <input
                type="text"
                name="mobilePhone"
                value={formData.mobilePhone}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex items-center gap-4 ">
              <label className="block text-sm mr-2 w-1/3 ">
                Receive email notifications:
              </label>
              <input
                type="checkbox"
                name="receiveEmailNotifications"
                checked={formData.receiveEmailNotifications}
                onChange={handleChange}
                className="form-checkbox h-5 text-blue-600 w-5 "
              />
            </div>

            <div className="flex items-center gap-4 ">
              <label className="block text-sm mr-2 w-1/3 ">
                Receive text notifications:
              </label>
              <input
                type="checkbox"
                name="receiveTextNotifications"
                checked={formData.receiveTextNotifications}
                onChange={handleChange}
                className="form-checkbox h-5 text-blue-600 w-5"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-4 ">
          <button
            type="submit"
            className="bg-[#4C9A2A] hover:bg-green-700 text-white font-bold py-2 px-10 rounded-md"
          >
            Sign up
          </button>
        </div>

        <p className="text-center text-sm">
          By continuing, you agree to our Terms & Conditions.
        </p>
      </form>
    </div>
  );
};

export default SignUpDetails;
