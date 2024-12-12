import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useGlobal } from "@/context/GlobalContext";
import PriceInput from "./PriceInput";

const PostOrderPricing = () => {
  const { baseUrl } = useGlobal();
  const [zonePrices, setZonePrices] = useState([]);
  const [additionalPrices, setAdditionalPrices] = useState([]);

  //? zone handlers
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  //? additional prices handlers
  const [loading2, setLoading2] = useState(false);
  const [editAdditionalPrices, setEditAdditionalPrices] = useState(null);

  //? subscription price handlers
  const [subscription, setSubscription] = useState(null);
  const [edit2, setEdit2] = useState(false);
  const [loading4, setLoading4] = useState(false);

  async function handleEdit(id) {
    if (!edit || selectedZone !== id) {
      setEdit(true);
      setSelectedZone(id);
      setEditResetPrice(false);
    } else {
      setLoading(true);
      try {
        const zone = zonePrices.find((zone) => zone._id === id);
        const res = await axios.patch(
          `${baseUrl}/api/pricing/edit-zone-prices`,
          {
            id,
            price: Number(zone.price),
            resetPrice: Number(zone.resetPrice),
          },
          { withCredentials: true, validateStatus: (status) => status < 500 }
        );
        if (res.status !== 200) {
          toast.error(res.data.msg);
        } else {
          toast.success("Zone prices updated successfully");
          setEdit(false);
          setZonePrices((prev) =>
            prev.map((zone) =>
              zone._id === id
                ? {
                    ...zone,
                    price: res.data.price,
                    resetPrice: res.data.resetPrice,
                  }
                : zone
            )
          );
        }
      } catch (error) {
        toast.error(error.response.data.msg);
        setEdit(false);
      } finally {
        setLoading(false);
      }
    }
  }

  async function getZonePrices() {
    try {
      const res = await axios.get(`${baseUrl}/api/pricing/get-zone-prices`, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      if (res.status !== 200) {
        toast.error(res.data.msg);
      } else {
        console.log(res.data);
        const filteredPrices = res.data.zonePrices.filter(
          (price) => price.type === "postOrder"
        );
        setZonePrices(filteredPrices);
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }

  async function getAdditionalPrices() {
    try {
      const res = await axios.get(
        `${baseUrl}/api/pricing/get-additional-prices`,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );
      const filteredPrices = res.data.additionalPrices.filter(
        (price) => price.type === "postOrder"
      );
      setSubscription(
        res.data.additionalPrices.find((price) => price.name === "subscription")
      );
      setAdditionalPrices(filteredPrices);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }

  async function updateAdditionalPrices(id, name) {
    if (editAdditionalPrices !== id) {
      setEditAdditionalPrices(id);
    } else {
      setLoading2(true);
      const additionalPrice = additionalPrices.find(
        (price) => price._id === id
      );
      try {
        const res = await axios.patch(
          `${baseUrl}/api/pricing/edit-additional-prices`,
          { id, price: Number(additionalPrice.price) },
          { withCredentials: true, validateStatus: (status) => status < 500 }
        );
        if (res.status !== 200) {
          toast.error(res.data.msg);
        } else {
          toast.success(`${name} updated successfully`);
          setEditAdditionalPrices(null);
        }
      } catch (error) {
        toast.error("Server Error updating additional prices");
      } finally {
        setLoading2(false);
      }
    }
  }

  async function handleUpdateSubscription() {
    if (!edit2) {
      setEdit2(true);
    } else {
      setLoading4(true);

      try {
        const res = await axios.patch(
          `${baseUrl}/api/pricing/edit-subscription-prices`,
          { id: subscription._id, price: Number(subscription.price) },
          { withCredentials: true, validateStatus: (status) => status < 500 }
        );
        if (res.status !== 201) {
          toast.error(res.data.msg);
        } else {
          toast.success(`Subscription updated successfully`);
          setEdit2(false);
        }
      } catch (error) {
        toast.error("Server Error updating subscription");
      } finally {
        setLoading4(false);
        setEdit2(false);
      }
    }
  }

  useEffect(() => {
    getZonePrices();
    getAdditionalPrices();
  }, []);

  useEffect(() => {
    console.log(subscription);
  }, [additionalPrices, zonePrices, subscription]);

  return (
    <div className="post-order-pricing mx-[5%] h-full flex flex-col gap-8 p-12 ">
      <div className="zone-fee flex flex-col gap-4">
        <div className="grid grid-cols-2 items-center">
          <h2 className="text-2xl font-bold">Zone Fee</h2>
        </div>
        {zonePrices?.map((zone, index) => (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 relative">
                <div className="flex items-center gap-2 w-full border-2 border-[#000000] rounded-md p-2">
                  $
                  <input
                    disabled={!edit || selectedZone !== zone._id}
                    className="border-0 focus:outline-none w-full"
                    type="number"
                    placeholder="Zone Fee"
                    value={zone.price}
                    onChange={(e) =>
                      setZonePrices((prev) =>
                        prev.map((zone, i) =>
                          i === index
                            ? { ...zone, price: e.target.value }
                            : zone
                        )
                      )
                    }
                  />
                </div>
                <button
                  onClick={() => handleEdit(zone._id)}
                  disabled={loading}
                  className={` ${
                    loading && selectedZone === zone._id
                      ? "bg-[#34CAA5] text-white"
                      : edit && selectedZone === zone._id
                      ? "bg-[#34CAA5] text-white"
                      : ""
                  } border-2 border-[#34CAA5] px-6 py-2 rounded-md`}
                >
                  {loading && selectedZone === zone._id
                    ? "Saving..."
                    : edit && selectedZone === zone._id
                    ? "Save"
                    : "Edit"}
                </button>
              </div>
              <label
                className="text-xs max-w-[350px] overflow-hidden text-ellipsis whitespace-nowrap "
                htmlFor="zone1"
              >
                {zone.text.slice(0, zone.text.indexOf("-"))}
              </label>
            </div>
          </div>
        ))}
      </div>

      {additionalPrices.map((price) => (
        <PriceInput
          key={price._id}
          price={price}
          updateAdditionalPrices={updateAdditionalPrices}
          editAdditionalPrices={editAdditionalPrices}
          setAdditionalPrices={setAdditionalPrices}
          additionalPrices={additionalPrices}
          loading2={loading2}
        />
      ))}

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 items-center">
          <h2 className="text-2xl font-bold">Subscription Fee </h2>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="flex items-center gap-2 border-2 border-[#000000] rounded-md p-2">
            $
            <input
              disabled={!edit2}
              className="border-0 focus:outline-none w-full"
              type="number"
              placeholder="Zone Fee"
              value={subscription?.price}
              onChange={(e) =>
                setSubscription((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
          </div>
          <button
            onClick={() => handleUpdateSubscription()}
            disabled={loading4}
            className={` ${
              loading4 || edit2
                ? "bg-[#34CAA5] text-white"
                : ""
            } border-2 border-[#34CAA5] px-6 py-2 rounded-md`}
          >
            {loading4 ? "Saving..." : edit2 ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostOrderPricing;
