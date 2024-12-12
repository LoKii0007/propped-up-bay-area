import { useEffect, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import axios from "axios";
import toast from "react-hot-toast";
import ConnectedAccounts from "./ConnectedAccounts";
import { useAuth } from "../context/AuthContext";
import { Switch } from "@/components/ui/switch";
import ResetPassword from "./ResetPass";
import { SearchableSelect } from "@/ui/SearchableSelect";
import { colors } from "../helpers/utilities";

const getRandomColor = (letter) => {

  // Convert letter to uppercase to handle case-insensitivity
  const uppercaseLetter = letter.toUpperCase();

  // Find the matching range
  const color = colors.find(({ range }) => {
    const [start, end] = range.split("-");
    return uppercaseLetter >= start && uppercaseLetter <= end;
  });

  return color?.color || "bg-gray-500"; // Default color if no match
};

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
  const { baseUrl } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();
  const [forget, setForget] = useState(false);
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(user?.img || null);
  const [selectedFileName, setSelectedFileName] = useState("");

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
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Upload the image if it exists
      let uploadedImgUrl = img; // Retain existing image URL
      if (img && typeof img !== "string") {
        const formData = new FormData();
        formData.append("file", img); // Append the image file

        const uploadRes = await axios.post(
          `${baseUrl}/api/update/user-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (uploadRes.status === 200) {
          uploadedImgUrl = uploadRes.data.url;
          setImgUrl(uploadRes.data.url);
        } else {
          toast.error("Image upload failed. Please try again.");
          return;
        }
      }

      // Step 2: Update user profile with form data and uploaded image URL
      const data = {
        ...formData,
        img: uploadedImgUrl, // Include the image URL
        receiveEmailNotifications: emailNotifications,
        receiveTextNotifications: textNotifications,
      };

      const res = await axios.patch(
        `${baseUrl}/api/update/user-details`,
        data,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        setCurrentUser(res.data.user);
        toast.success("Profile updated successfully.");
      } else {
        toast.error(res.data.msg || "Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Profile update failed", error.message);
      toast.error("Server error. Please try again.");
    } finally {
      setIsEditing(false);
      setLoading(false);
    }
  };

  // Handling file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file); // Store the file for upload during the profile update
      setSelectedFileName(file.name);
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
        { withCredentials: true, validateStatus: (status) => status < 500 }
      );
      if (res.status === 200) {
        toast.success("Password changed successfully.");
      } else {
        toast.error(
          res.data.message || "password change failed. Please try again"
        );
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setPassLoading(false);
    }
  }

  useEffect(() => {}, [
    loadingDetails,
    formData,
    currentUser,
    initialState,
    userDetails,
    user,
    forget,
    img,
    imgUrl
  ]);

  useEffect(() => {
    setFormData(initialState);
  }, [user, userDetails]);

  return (
    <div className="bg-white client-profile rounded-lg md:p-12 p-2 flex flex-col gap-12 mx-auto">
      <div className="flex items-center space-x-4 user-logo">
        {imgUrl ? (
          <img
            className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-green-700 object-cover "
            src={imgUrl}
            alt="User Avatar"
          />
        ) : (
          <div
            className={`w-10 h-10 md:w-16 md:h-16 rounded-full text-2xl flex items-center justify-center text-white font-bold ${getRandomColor(
              user?.firstName
            )}`}
          >
            {user?.firstName?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        {isEditing && (
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center justify-center "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-paperclip"
            >
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            {/* {imgUrl ? "Update Image" : "Upload Image"} */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFileName && (
              <p className="mt-2 text-sm text-gray-500">
                <span className="font-semibold">
                  {selectedFileName.length > 10
                    ? `${selectedFileName.slice(
                        0,
                        5
                      )}...${selectedFileName.slice(
                        selectedFileName.lastIndexOf(".")
                      )}`
                    : selectedFileName}
                </span>
              </p>
            )}
          </label>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {formData.email}
          </h2>
        </div>
      </div>

      {!loadingDetails ? (
        <form className=" md:p-6 px-2 py-4 rounded-2xl client-form flex flex-col md:gap-6 gap-4 ">
          <div className="font-semibold text-lg px-2 ">Edit profile details</div>

          <div className="grid grid-cols-2 md:gap-6 gap-3 edit-profile-fields">
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
              <SearchableSelect
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                editing={isEditing}
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

            <div className="mt-1 p-2 block w-full border rounded-md border-[#E5E7EB ] ">
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

          <div className="space-y-4 md:px-4 px-1 ">
            <div className="flex items-center gap-4 w-full md:w-2/3 lg:w-1/2 justify-between">
              <label className="text-[#6C737F] ">
                Receive email notifications:
              </label>
              <Switch
                checked={emailNotifications}
                onCheckedChange={() =>
                  setEmailNotifications(!emailNotifications)
                }
                className="toggle toggle-primary"
                disabled={!isEditing}
                id="switch"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-2/3 lg:w-1/2 justify-between">
              <label className="text-[#6C737F] ">
                Receive text notifications:
              </label>
              <Switch
                checked={textNotifications}
                onCheckedChange={() => setTextNotifications(!textNotifications)}
                className="toggle toggle-primary"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex gap-8 items-center md:p-3 p-1">
            {isEditing ? (
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={loading}
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
              disabled={!isEditing}
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

      {user?.connectedAccounts?.includes("Email") &&
        (!forget ? (
          <form
            onSubmit={handleChangePassword}
            className="space-y-6 md:p-6 px-2 py-4 rounded-2xl client-form "
          >
            <div className="font-semibold grid text-lg">Change password</div>
            <div className="xl:w-1/2 lg:w-2/3 w-full border p-2 rounded-md  ">
              <label className="block text-xs text-gray-700">
                Old password
              </label>
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
                  {showOldPass ? (
                    <img src="/svg/show.svg" alt="hide" />
                  ) : (
                    <img src="/svg/hide.svg" alt="show" />
                  )}
                </button>
              </div>
            </div>

            <div className="xl:w-1/2 lg:w-2/3 w-full border p-2 rounded-md  ">
              <label className="block text-xs text-gray-700">
                New password
              </label>
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
                  {showNewPass ? (
                    <img src="/svg/show.svg" alt="hide" />
                  ) : (
                    <img src="/svg/hide.svg" alt="show" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <button
                disabled={passLoading}
                type="submit"
                className="m-3 w-full md:w-[180px] border-green-800 font-semibold border text-green-800 px-4 py-2 rounded-md hover:border-green-900"
              >
                {passLoading ? "changing..." : "Change Password"}
              </button>

              <div
                onClick={() => setForget(true)}
                className="cursor-pointer underline"
              >
                Forgot password
              </div>
            </div>
          </form>
        ) : (
          <ResetPassword setForget={setForget} />
        ))}

      <ConnectedAccounts />
    </div>
  );
};

export default EditProfileForm;
