import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";

const ProfileSettings = () => {
  const { admin, setAdmin } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState(admin?.firstName || "");
  const [lastName, setLastName] = useState(admin?.lastName || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [phone, setPhone] = useState(admin?.phone || "");
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const { baseUrl } = useGlobal();
  const [imgUrl, setImgUrl] = useState(admin?.img);
  const [imgLoading, setImgLoading] = useState(false);

  // Reset function
  const handleReset = () => {
    setFirstName(admin?.firstName || "");
    setLastName(admin?.lastName || "");
    setEmail(admin?.email || "");
    setPhone(admin?.phone || "");
    setIsEditable(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditable) {
      setIsEditable(true);
    } else {
      setLoading(true);
      try {
        const res = await axios.patch(
          `${baseUrl}/auth/admin/profile/update`,
          { profilePic, firstName, lastName, email, phone },
          { withCredentials: true, validateStatus: (status) => status < 500 }
        );
        if (res.status !== 200) {
          toast.error(
            res.data.msg || "Profile update failed. Please try again"
          );
        }
        toast.success("Profile updated successfully!");
        setAdmin(res.data.user);
      } catch (error) {
        toast.error("Failed to update profile.");
      } finally {
        setLoading(false);
        setIsEditable(false);
      }
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setImgUrl(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleImageUpdate = async (img) => {
    if (!img || typeof img === "string") return img; // Skip if no file or already a URL
    setImgLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", img);

      const uploadRes = await axios.post(
        `${baseUrl}/auth/admin/image/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (uploadRes.status === 200) {
        toast.success("Image updated.");
        const uploadedUrl = uploadRes.data.url;
        setImgUrl(uploadedUrl);
        setAdmin(uploadRes.data?.user);
        sessionStorage.setItem(
          "proppedUpAdmin",
          JSON.stringify(uploadRes.data?.user)
        );
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setProfilePic(null);
      setImgLoading(false);
    }
  };

  useEffect(() => {}, [admin, imgUrl]);

  return (
    <>
      <div className="w-full max-w-4xl">
        <div className="space-y-2 mb-6">
          <label
            htmlFor="profilePic"
            className="block font-medium text-gray-700"
          >
            Your Profile Picture
          </label>
          <div className="flex gap-5">

            <div className="flex items-center justify-center w-32 h-32 bg-[#EDF2F6] border border-dashed border-[#4C535F] rounded-md overflow-hidden">
              {imgUrl ? (
                <label htmlFor="profilePic" className="cursor-pointer">
                  <img
                    src={imgUrl}
                    alt="Profile"
                    className=" h-[250px] object-cover"
                  />
                </label>
              ) : (
                <label
                  htmlFor="profilePic"
                  className="text-center cursor-pointer text-gray-400 items-center justify-center h-full flex flex-col"
                >
                  <p>Upload your photo</p>
                </label>
              )}
              <input
                type="file"
                id="profilePic"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Update Image Button */}
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={() => handleImageUpdate(profilePic)}
                className={`px-4 py-2 rounded-md text-white ${
                  loading ? "bg-gray-400" : "bg-teal-500 hover:bg-teal-600"
                } focus:outline-none focus:ring-2 focus:ring-teal-400`}
                disabled={loading}
              >
                {imgLoading ? "Updating..." : "Update Image"}
              </button>
            </div>
          </div>
        </div>

        <form className="space-y-4 flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Input Fields */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Please enter your first name"
                  className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Please enter your last name"
                  className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Please enter your email"
                  className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Please enter your phone number"
                  className="w-full mt-1 p-2 border border-[#E0E4EC] bg-[#EDF2F6] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-teal-500 hover:bg-teal-600"
              } focus:outline-none focus:ring-2 focus:ring-teal-400`}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditable
                ? "Save Changes"
                : "Edit Profile"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={!isEditable}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileSettings;
