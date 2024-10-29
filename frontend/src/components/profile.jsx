import { useState } from "react";
import { UseGlobal } from "../context/GlobalContext";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfileForm = ({userDetails, user}) => {
  
  const initialState = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    company: userDetails?.company,
    state: userDetails?.state,
    mobilePhone: userDetails?.mobilePhone,
    workPhone: userDetails?.workPhone,
    email: user.email,
    zipCode: userDetails?.zipCode,
    caDreLicense: userDetails?.caDreLicense,
    address : userDetails?.address
  }

  const [formData, setFormData] = useState(initialState);
  const [emailNotifications, setEmailNotifications] = useState(userDetails?.receiveEmailNotifications|| false);
  const [textNotifications, setTextNotifications] = useState(userDetails?.receiveTextNotifications || false);
  const [isEditing, setIsEditing] = useState(false);
  const {baseUrl} = UseGlobal()
  const [loading, setLoading] = useState(false)

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle update profile (save and disable form)
  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      const data = {...formData,receiveEmailNotifications:emailNotifications, receiveTextNotifications : textNotifications }
      const res = await axios.patch(`${baseUrl}/api/update/userDetails`, data, {withCredentials:true})
      if(res.status === 200){
        toast.success('Profile updated successfully.')
      }else{
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log('Profile update failed',error.message )
      toast.error('Profile update failed. Please try again',)
    }finally{
      setIsEditing(false);
      console.log("Updated Profile:", formData);
      setLoading(false)
    }
  };

  // Handle edit mode
  const enableEditMode = () => {
    setIsEditing(true);
  };

  function handleCancel(){
    setIsEditing(false)
    setFormData(initialState)
  }
  

  return (
    <div className="bg-white rounded-lg p-12 mx-auto">
      <div className="flex items-center space-x-4 mb-10">
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

      <form className="shadow-md p-6 rounded-2xl">
        <div className="grid grid-cols-2 gap-6">

          <div className="mt-1 p-2 block w-full border rounded-md border-[#E5E7EB ] ">
            <label className="text-[#6C737F] block text-xs ">First Name</label>
            <input
              type="text"
              name="firstName"
              className="w-full  "
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
              className="w-full  "
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
              className="w-full  "
              value={formData.company}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
            <label className="text-[#6C737F] block text-xs ">State/Region</label>
            <input
              type="text"
              name="state"
              className="w-full  "
              value={formData.state}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
            <label className="text-[#6C737F] block text-xs ">CA DRE License</label>
            <input
              type="text"
              name="caDreLicense"
              className="w-full  "
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
              className="w-full  "
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
            <label className="text-[#6C737F] block text-xs ">Work Phone</label>
            <input
              type="number"
              name="workPhone"
              className="w-full  "
              value={formData.workPhone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
            <label className="text-[#6C737F] block text-xs ">MobilePhone</label>
            <input
              type="number"
              name="mobilePhone"
              className="w-full "
              value={formData.mobilePhone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

        </div>

        <div className="mt-6 space-y-4 px-4">
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
            <label className="text-[#6C737F] ">Receive text notifications:</label>
            <input
              type="checkbox"
              checked={textNotifications}
              onChange={() => setTextNotifications(!textNotifications)}
              className="toggle toggle-primary"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex gap-8 items-center mt-8 p-3">
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
    </div>
  );
}

export default EditProfileForm;
