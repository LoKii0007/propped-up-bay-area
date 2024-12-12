import { useGlobal } from "@/context/GlobalContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import PriceInput from "./PriceInput";
import { zones } from "@/data/staticData";

const OpenhousePricing = () => {
  const { baseUrl } = useGlobal();
  const [zonePrices, setZonePrices] = useState([]);
  const [additionalPrices, setAdditionalPrices] = useState([]);

  //? zone handlers
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  //? reset price handlers
  const [editResetPrice, setEditResetPrice] = useState(false);
  const [loading3, setLoading3] = useState(false);

  //? additional prices handlers
  const [loading2, setLoading2] = useState(false);
  const [editAdditionalPrices, setEditAdditionalPrices] = useState(null);

  //?------------------------------
  //? loading initial zones
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
          (price) => price.type === "openHouse"
        ).sort((a,b)=> a.index - b.index);
        setZonePrices(filteredPrices);
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }

  //?------------------------------
  //? updating zone prices
  async function handleEdit(id) {
    if ( !edit || selectedZone !== id) {
      setEdit(true);
      setSelectedZone(id);
      setEditResetPrice(false)
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
        setEdit(null);
      } finally {
        setLoading(false);
      }
    }
  }

  //?------------------------------
  //? updatin zone reset prices
  async function handleEditResetPrice(id) {
    if (!editResetPrice || selectedZone !== id ) {
      setEditResetPrice(true);
      setSelectedZone(id);
      setEdit(false)
    } else {
      setLoading3(true);
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
          setEditResetPrice(false);
          setSelectedZone(null)
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
        setEditResetPrice(false);
      } finally {
        setLoading3(false);
      }
    }
  }

  //?------------------------------
  //? loading additional prices
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
        (price) => price.type === "openHouse"
      );
      setAdditionalPrices(filteredPrices);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }

  //?------------------------------
  //? updating additional prices
  async function updateAdditionalPrices(id, name) {
    if (editAdditionalPrices !== id) {
      setEditAdditionalPrices(id);
    } else {
      const additionalPrice = additionalPrices.find(
        (price) => price._id === id
      );
      setLoading2(true);
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

  useEffect(() => {
    getZonePrices();
    getAdditionalPrices();
  }, []);

  useEffect(() => {
    // console.log(zonePrices);
  }, [zonePrices, additionalPrices]);

  const handleAddZonePrices = async () => {
    try {
      const zonePrice = zones[11];
      const res = await axios.post(
        `${baseUrl}/api/pricing/add-zone-prices`,
        zonePrice,
        { withCredentials: true, validateStatus: (status) => status < 500 }
      );
      if (res.status !== 200) {
        toast.error(res.data.msg);
      } else {
        toast.success("Zone prices added successfully");
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const handleAddAdditionalPrices = async () => {
    try {
      const price = {
        price: 35,
        name: "Lighting",
        type: "postOrder",
      };

      const res = await axios.post(
        `${baseUrl}/api/pricing/add-additional-prices`,
        price,
        { withCredentials: true, validateStatus: (status) => status < 500 }
      );
      if (res.status !== 200) {
        toast.error(res.data.msg);
      } else {
        toast.success("Zone prices added successfully");
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <>
      <div className="open-pricing mx-[5%] h-full flex flex-col gap-8 p-12 ">
        {/* <button onClick={handleAddZonePrices}>Add Zone Prices</button> */}

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

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 relative">
                  <div className="flex items-center gap-2 w-full border-2 border-[#000000] rounded-md p-2">
                    ${" "}
                    <input
                      disabled={!editResetPrice || selectedZone !== zone._id}
                      className="border-0 focus:outline-none w-full"
                      type="number"
                      placeholder="Reset Price"
                      value={zone.resetPrice}
                      onChange={(e) =>
                        setZonePrices((prev) =>
                          prev.map((zone, i) =>
                            i === index
                              ? { ...zone, resetPrice: e.target.value }
                              : zone
                          )
                        )
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleEditResetPrice(zone._id)}
                    disabled={loading3}
                    className={` ${
                      loading3 && selectedZone === zone._id
                        ? "bg-[#34CAA5] text-white"
                        : editResetPrice && selectedZone === zone._id
                        ? "bg-[#34CAA5] text-white"
                        : ""
                    } border-2 border-[#34CAA5] px-6 py-2 rounded-md`}
                  >
                    {loading3 && selectedZone === zone._id
                      ? "Saving..."
                      : editResetPrice && selectedZone === zone._id
                      ? "Save"
                      : "Edit"}
                  </button>
                </div>
                <label className="text-xs" htmlFor="zone1">
                  Reset Price
                </label>
              </div>
            </div>
          ))}
        </div>

        {additionalPrices?.map((price) => (
          <PriceInput
            key={price._id}
            updateAdditionalPrices={updateAdditionalPrices}
            loading2={loading2}
            editAdditionalPrices={editAdditionalPrices}
            price={price}
            setAdditionalPrices={setAdditionalPrices}
            additionalPrices={additionalPrices}
          />
        ))}
      </div>
    </>
  );
};

export default OpenhousePricing;
