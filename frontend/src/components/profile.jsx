import { useState } from "react";

const EditProfileForm = () => {
  // Initial form data state
  const [formData, setFormData] = useState({
    firstName: "Miron ",
    lastName: "vitold",
    country: "USA",
    stateRegion: "New York",
    mobilePhone: 55748327439,
    workPhone: 55748327439,
    address2: "House #25",
    email: "miron.vitold@devias.io",
    zipCode: 122017,
    caDreLicense: "something",
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [textNotifications, setTextNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Track whether form is in edit mode or not

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle update profile (save and disable form)
  const handleUpdateProfile = () => {
    // Save changes and disable form
    setIsEditing(false);
    console.log("Updated Profile:", formData); // Send this data to a backend API or handle it
  };

  // Handle edit mode
  const enableEditMode = () => {
    setIsEditing(true);
  };

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
            <label className="text-[#6C737F] block text-xs ">Country</label>
            <input
              type="text"
              name="country"
              className="w-full  "
              value={formData.country}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mt-1 p-2  block w-full border rounded-md border-[#E5E7EB ] ">
            <label className="text-[#6C737F] block text-xs ">State/Region</label>
            <input
              type="text"
              name="stateRegion"
              className="w-full  "
              value={formData.stateRegion}
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
              name="address2"
              className="w-full  "
              value={formData.address2}
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
            onClick={() => setIsEditing(false)} // Cancel editing
            className="text-gray-700 font-semibold px-4 py-2 rounded-md hover:"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
