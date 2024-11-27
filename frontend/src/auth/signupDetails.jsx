import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";
import { useAuth } from "../context/AuthContext";
import { SearchableSelect } from "@/ui/SearchableSelect";

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

  const navigate = useNavigate();
  const { baseUrl } = useGlobal();
  const {setCurrentUser } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const editing = true

  //?---------------------------------
  //? form submission
  //?---------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(formData);
    try {
      const res = await axios.post(
        `${baseUrl}/auth/sign-up/details`,
        formData,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );
      if (res.status !== 201) {
        toast.error(res.data.msg || "Error adding details. Please try again");
        return;
      }
      toast.success("submitted succesfully");
      setFormData(initialState); // cleanup of form
      sessionStorage.setItem("proppedUpUser", JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);
      navigate("/"); // navigating to homepage
    } catch (error) {
      toast.error("Server error. Please try again");
    } finally {
      setLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 details-form">
        <div>
          <h2 className="text-lg font-semibold mb-4">Client Details</h2>

          <div className="grid gap-5">
            <div className="flex w-full items-center gap-4 form-item ">
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

            <div className="flex w-full items-center gap-4 form-item ">
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

            <div className="flex w-full items-center gap-4 form-item ">
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

            <div className="flex w-full items-center gap-4 form-item ">
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

            <div className="flex w-full items-center gap-4 form-item ">
              <label className="block text-[16px] w-1/3">State</label>
              <SearchableSelect
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                editing={editing}
              />
            </div>

            <div className="flex w-full items-center gap-4 form-item ">
              <label className="block text-[16px] w-1/3">Zip Code</label>
              <input
                type="number"
                name="zipCode"
                value={formData.zipCode}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex w-full items-center gap-4 form-item ">
              <label className="block text-[16px] w-1/3">Work Phone</label>
              <input
                type="number"
                name="workPhone"
                value={formData.workPhone}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex w-full items-center gap-4 form-item ">
              <label className="block text-[16px] w-1/3">Mobile Phone</label>
              <input
                type="number"
                name="mobilePhone"
                value={formData.mobilePhone}
                required
                onChange={handleChange}
                className="border border-[#646464] rounded px-3 py-2 w-2/3 "
              />
            </div>

            <div className="flex items-center gap-4 notification ">
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

            <div className="flex items-center gap-4 notification">
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
            disabled={loading}
            className="bg-[#4C9A2A] hover:bg-green-700 text-white font-bold py-2 px-10 rounded-md"
          >
            {loading ? "Submitting..." : "Sign up"}
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
