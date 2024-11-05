import { useEffect, useState } from "react";
import { UseGlobal } from "../context/GlobalContext";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfileForm = ({ userDetails, user, loadingDetails }) => {
  const initialState = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    company: userDetails?.company,
    state: userDetails?.state,
    mobilePhone: userDetails?.mobilePhone,
    workPhone: userDetails?.workPhone,
    email: user?.email,
    zipCode: userDetails?.zipCode,
    caDreLicense: userDetails?.caDreLicense,
    address: userDetails?.address,
  };

  const [formData, setFormData] = useState({});
  const [emailNotifications, setEmailNotifications] = useState(
    userDetails?.receiveEmailNotifications || false
  );
  const [textNotifications, setTextNotifications] = useState(
    userDetails?.receiveTextNotifications || false
  );
  const [isEditing, setIsEditing] = useState(false);
  const { baseUrl } = UseGlobal();
  const [loading, setLoading] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  //?--------------------------
  //? Handle form input change
  //?--------------------------
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //?--------------------------
  //? Handle update profile (save and disable form)
  //?--------------------------
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const data = {
        ...formData,
        receiveEmailNotifications: emailNotifications,
        receiveTextNotifications: textNotifications,
      };
      const res = await axios.patch(`${baseUrl}/api/update/userDetails`, data, {
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Profile updated successfully.");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Profile update failed", error.message);
      toast.error("Profile update failed. Please try again");
    } finally {
      setIsEditing(false);
      setLoading(false);
    }
  };

  //? Handle edit mode
  const enableEditMode = () => {
    setIsEditing(true);
  };

  function handleCancel() {
    setIsEditing(false);
    setFormData(initialState);
  }

  //?--------------------------
  //? Handle change password
  //?--------------------------
  async function handleChangePassword(e) {
    e.preventDefault();
    setPassLoading(true);
    if (currentPass === newPass) {
      toast.error(`New password can't be same as old password`);
      setPassLoading(false);
      return;
    }
    try {
      const res = await axios.patch(
        `${baseUrl}/auth/update/password`,
        { currentPass, newPass },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Password changed successfully.");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Password change failed. Please try again.");
    } finally {
      setPassLoading(false);
    }
  }

  useEffect(()=>{}, [loadingDetails])

  useEffect(()=>{
    setFormData(initialState)
  }, [formData, user , userDetails])

  return (
    <div className="bg-white rounded-lg p-12 flex flex-col gap-12 mx-auto">
      <div className="flex items-center space-x-4 ">
        <img
          className="w-16 h-16 rounded-full"
          src="https://via.placeholder.com/150"
          alt="User Avatar"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {formData.email}
          </h2>
          <p className="text-sm text-gray-500">
            user_id: 5e86805e2bafd54f66cc95c3
          </p>
        </div>
      </div>

      {!loadingDetails ? (
        <form className=" p-6 rounded-2xl client-form flex flex-col gap-6 ">
          <div className="font-semibold text-lg">Edit profile details</div>

          <div className="grid grid-cols-2 gap-6">
            <div className="mt-1 p-2 block w-full border rounded-md border-[#E5E7EB]">
              <label className="text-[#6C737F] block text-xs ">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700 "
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
              <label className="text-[#6C737F] block text-xs ">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700 "
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
              <label className="text-[#6C737F] block text-xs ">company</label>
              <input
                type="text"
                name="company"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700 "
                value={formData.company}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
              <label className="text-[#6C737F] block text-xs ">
                State/Region
              </label>
              <input
                type="text"
                name="state"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700 "
                value={formData.state}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
              <label className="text-[#6C737F] block text-xs ">
                CA DRE License
              </label>
              <input
                type="text"
                name="caDreLicense"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700 "
                value={formData.caDreLicense}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
              <label className="text-[#6C737F] block text-xs ">Address</label>
              <input
                type="text"
                name="address"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700 "
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
              <label className="text-[#6C737F] block text-xs ">
                Work Phone
              </label>
              <input
                type="number"
                name="workPhone"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700 "
                value={formData.workPhone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
              <label className="text-[#6C737F] block text-xs ">
                MobilePhone
              </label>
              <input
                type="number"
                name="mobilePhone"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700 "
                value={formData.mobilePhone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-4 px-4">
            <div className="flex items-center gap-4 w-full md:w-2/3 lg:w-1/2 justify-between">
              <label className="text-[#6C737F] ">
                Receive email notifications:
              </label>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="toggle toggle-primary"
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-2/3 lg:w-1/2 justify-between">
              <label className="text-[#6C737F] ">
                Receive text notifications:
              </label>
              <input
                type="checkbox"
                checked={textNotifications}
                onChange={() => setTextNotifications(!textNotifications)}
                className="toggle toggle-primary"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex gap-8 items-center p-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleUpdateProfile}
                className="border-green-800 font-semibold border text-green-800 px-4 py-2 rounded-md hover:border-green-900"
              >
                Save Changes
              </button>
            ) : (
              <button
                type="button"
                onClick={enableEditMode}
                className="border-green-800 font-semibold border text-green-800 px-4 py-2 rounded-md hover:border-green-900"
              >
                Edit Profile
              </button>
            )}
            <button
              type="button"
              onClick={() => handleCancel()} // Cancel editing
              className="text-gray-700 font-semibold px-4 py-2 rounded-md hover:"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">Loading...</div>
      )}

      <form
        onSubmit={handleChangePassword}
        className="space-y-6 p-6 rounded-2xl client-form "
      >
        <div className="font-semibold grid text-lg">Change password</div>
        <div className="xl:w-1/2 lg:w-2/3 w-full border p-2 rounded-md  ">
          <label className="block text-xs text-gray-700">Old password</label>
          <div className="relative mt-1">
            <input
              type={showOldPass ? "text" : "password"}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className="block w-full border-white focus:outline-none border-b focus:border-green-800 "
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPass(!showOldPass)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showOldPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="xl:w-1/2 lg:w-2/3 w-full border p-2 rounded-md  ">
          <label className="block text-xs text-gray-700">New password</label>
          <div className="relative mt-1">
            <input
              type={showNewPass ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="block w-full border-white focus:outline-none border-b focus:border-green-800 "
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showNewPass ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-gray-500">Minimum 6 characters</p>
        </div>

        <button
          disabled={passLoading}
          type="submit"
          className="m-3 w-[180px] border-green-800 font-semibold border text-green-800 px-4 py-2 rounded-md hover:border-green-900"
        >
          {passLoading ? "changing..." : "Change Password"}
        </button>
      </form>
      {/* <svg className="animate-spin fill-green-800 h-5 w-5 mr-3 " viewBox="0 0 24 24"></svg> */}
    </div>
  );
};

export default EditProfileForm;
