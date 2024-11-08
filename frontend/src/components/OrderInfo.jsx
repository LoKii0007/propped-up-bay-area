import React, { useEffect, useState } from "react";
import ChangeStatusModal from "../ui/ChangeStatusModal";
import { useAuth } from "../context/AuthContext";
import CancelSubModal from "../ui/CancelSubModal";
import { parseDate } from "../helpers/utilities";
import axios from "axios";
import { UseGlobal } from "../context/GlobalContext";
import toast from "react-hot-toast";

function OrderInfo({
  order,
  setPostOrders,
  setOrders,
  setCompleteOrder,
  setFilteredOrders,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { admin } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [uploading, setUploading] = useState(false); // State for upload status
  const { baseUrl, currentUser } = UseGlobal();
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {}, [order, setOrders, setPostOrders, imageUrl]);

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Function to upload image
  const uploadImage = async () => {
    if (!selectedImage) return alert("Please select an image.");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("orderId", order._id); // Assuming order ID is available

      const res = await axios.post(
        `${baseUrl}/api/${
          order.type === "openHouse" ? "open-house" : "post-order"
        }/image-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(res.data);
      if (res.status !== 200) {
        toast.error(res.data.msg || "Upload failed. Please try again");
        return;
      }
      setImageUrl(res.data.url);
      setSelectedImage(null)
      toast.success(res.data.msg || "Upload successfull");
    } catch (error) {
      setUploading(false);
      toast.error("Server error. Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Function to update image
  const updateImage = async () => {
    if (!selectedImage) return toast.error("Please select an image.");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("orderId", order._id); // Assuming order ID is available

      const res = await axios.patch(
        `${baseUrl}/api/${
          order.type === "openHouse" ? "open-house" : "post-order"
        }/image-update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(res.data);
      if (res.status !== 200) {
        toast.error(res.data.msg || "Upload failed. Please try again");
        return;
      }
      setImageUrl(res.data.url);
      setSelectedImage(null)
      toast.success(res.data.msg || "Upload successfull");
    } catch (error) {
      toast.error("Server error. Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // function to get image
  const getImage = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/orders/image-get`, {
        params: { orderId: order._id, type: order.type },
        withCredentials: true,
      });

      if (res.status === 200 && res.data.url) {
        setImageUrl(res.data.url);
      } else {
        setImageUrl(null); 
      }
    } catch (error) {
      // toast.error("Server error. Upload failed");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <>
      <div className="bg-white w-full h-full px-[5%] flex flex-col overflow-y-auto">
        <div className="flex justify-end mb-8 w-full">
          {/* <button className="text-[#718096] border px-4 py-2 rounded-lg hover:bg-gray-100">
            User Details
          </button> */}
          <div className="flex space-x-4">
            {["admin", "superuser"].includes(admin?.role) && (
              <button
                onClick={() => setModalOpen(true)}
                className="text-[#718096] border-[#34CAA5] border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Change Status
              </button>
            )}
            {!admin &&
              order?.type === "postOrder" &&
              order?.subActive === true && (
                <>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancel subscription
                  </button>
                </>
              )}
          </div>
        </div>

        <div className="px-12 mx-auto w-8/12">
          <h2 className="text-2xl w-full text-center font-semibold mb-6">
            {order.type} Details
          </h2>
          <div className="flex flex-col gap-x-10 gap-y-3">
            <p className="text-md grid grid-cols-2">
              <span>First Name:</span> {order.firstName}
            </p>
            <p className="text-md grid grid-cols-2">
              <span>Last Name:</span> {order.lastName}
            </p>
            <p className="text-md grid grid-cols-2">
              <span>Email:</span> {order.email}
            </p>

            {order.type === "openHouse" && (
              <>
                <p className="text-md grid grid-cols-2">
                  <span>Status:</span> {order.status}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">Phone Number:</span> {order.phone}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">First Event Date:</span>{" "}
                  {parseDate(order.requestedDate)}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">First Event Start Time:</span>{" "}
                  {order.firstEventStartTime}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">First Event End Time:</span>{" "}
                  {order.firstEventEndTime}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">Event Address:</span>{" "}
                  {`${order.firstEventAddress.streetAddress}, ${order.firstEventAddress.city}, ${order.firstEventAddress.state} ${order.firstEventAddress.postalCode}`}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">Zone:</span> {order.requiredZone.name} (
                  {order.requiredZone.text})
                </p>
                <p className="text-md grid grid-cols-2">
                  <span className="">Additional Signs:</span>{" "}
                  {order.additionalSignQuantity}
                </p>
                {order.twilightTourSlot && (
                  <p className="text-md grid grid-cols-2">
                    <span className="">Twilight Tour Slot:</span>{" "}
                    {order.twilightTourSlot}
                  </p>
                )}
                {order.printAddressSign && (
                  <>
                    <p className="text-md grid grid-cols-2">
                      <span className="">Print Address Sign:</span> Yes
                    </p>
                    <p className="text-md grid grid-cols-2">
                      <span className="">Print Address:</span>{" "}
                      {`{order.printAddress.streetAddress}, ${order.printAddress.city}, ${order.printAddress.state} ${order.printAddress.postalCode}`}
                    </p>
                  </>
                )}
                {order.additionalInstructions && (
                  <p className="text-md grid grid-cols-2">
                    <span className="">Additional Instructions:</span>{" "}
                    {order.additionalInstructions}
                  </p>
                )}
                <p className="text-md grid grid-cols-2">
                  <span className="">Total:</span> ${order.total}
                </p>
              </>
            )}

            {order.type === "postOrder" && (
              <>
                <p className="text-md grid grid-cols-2">
                  <span>Phone Number:</span> {order.phone}
                </p>
                <p className="text-md grid grid-cols-2 font-semibold ">
                  <span>Subscription :</span>{" "}
                  {order.subActive ? (
                    <span className="text-green-800">Active</span>
                  ) : (
                    <span className="text-red-800">Cancelled</span>
                  )}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Requested Date:</span> {parseDate(order.requestedDate)}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Listing Address:</span>{" "}
                  {`${order.listingAddress.streetAddress}, ${order.listingAddress.city}, ${order.listingAddress.state} ${order.listingAddress.postalCode}`}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Billing Address:</span>{" "}
                  {`${order.billingAddress.streetAddress}, ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postalCode}`}
                </p>
                <p className="text-md grid grid-cols-2">
                  <span>Zone:</span> {order.requiredZone.name} (
                  {order.requiredZone.text})
                </p>

                {order.postColor && (
                  <p className="text-md grid grid-cols-2">
                    <span>Post Color:</span> {order.postColor}
                  </p>
                )}
                {order.flyerBox && (
                  <p className="text-md grid grid-cols-2">
                    <span>Flyer Box:</span> Yes
                  </p>
                )}
                {order.lighting && (
                  <p className="text-md grid grid-cols-2">
                    <span>Lighting:</span> Yes
                  </p>
                )}
                {order.numberOfPosts > 0 && (
                  <p className="text-md grid grid-cols-2">
                    <span>Number of Posts:</span> {order.numberOfPosts}
                  </p>
                )}

                <p className="text-md grid grid-cols-2">
                  <span>Status:</span> {order.status}
                </p>

                <div className="text-md grid grid-cols-2">
                  <span>Riders:</span>
                  <div>
                    {Object.entries(order.riders).map(([rider, count]) =>
                      count > 0 ? (
                        <p key={rider}>
                          {rider.charAt(0).toUpperCase() + rider.slice(1)}:{" "}
                          {count}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>

                {order.additionalInstructions && (
                  <p className="text-md grid grid-cols-2">
                    <span>Additional Instructions:</span>{" "}
                    {order.additionalInstructions}
                  </p>
                )}
                <p className="text-md grid grid-cols-2">
                  <span>Total:</span> ${order.total}
                </p>
              </>
            )}
          </div>
        </div>

        {(admin?.role === "admin" || admin?.role === "superuser") && (
          <>
            {!isLoading ? (
              <div className="px-12 mx-auto w-8/12 py-6 flex flex-col gap-5 justify-center text-center ">
                {imageUrl ? (
                  <>
                    <img width={400} src={imageUrl} alt="" />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className=""
                    />
                    <button
                      onClick={() => updateImage()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Update Image"}
                    </button>
                  </>
                ) : (
                  <>
                    <label className="block font-medium text-gray-700 text-center ">
                      Upload Order Image
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className=""
                    />
                    <button
                      onClick={() => uploadImage()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="text-center">Loading...</div>
              </>
            )}
          </>
        )}

        {currentUser && (
          <>
            {!isLoading ? (
              <div className="px-12 mx-auto w-8/12 py-6 flex justify-center text-center ">
                {imageUrl ? (
                  <img width={400} src={imageUrl} alt="image" />
                ) : (
                  "Image not uploaded yet."
                )}
              </div>
            ) : (
              <>
                <div className="text-center">Loading...</div>
              </>
            )}
          </>
        )}
      </div>

      {/* -------------------------modals ---------------- */}
      {admin?.role === "admin" ? (
        <ChangeStatusModal
          setCompleteOrder={setCompleteOrder}
          order={order}
          open={modalOpen}
          setOpen={setModalOpen}
          setOrders={setOrders}
          setFilteredOrders={setFilteredOrders}
        />
      ) : (
        <CancelSubModal
          setPostOrders={setPostOrders}
          setOrders={setOrders}
          orderId={order._id}
          sessionId={order.sessionId}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}
    </>
  );
}

export default OrderInfo;
