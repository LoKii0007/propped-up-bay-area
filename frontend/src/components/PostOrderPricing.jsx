import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useGlobal } from "@/context/GlobalContext";
import PriceInput from "./PriceInput";

const PostOrderPricing = () => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [additionalPrices, setAdditionalPrices] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [editAdditionalPrices, setEditAdditionalPrices] = useState(false);
  const [selectedAdditionalPrice, setSelectedAdditionalPrice] = useState(null);
  const { baseUrl } = useGlobal();

  const handleEdit = () => {
    setEdit(!edit);
  };

  async function getAdditionalPrices() {
    try {
      const res = await axios.get(
        `${baseUrl}/api/pricing/get-additional-prices`,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );
      setAdditionalPrices(res.data.additionalPrices);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }

  async function updateAdditionalPrices(id) {
    if (!editAdditionalPrices) {
      setEditAdditionalPrices(true);
      setSelectedAdditionalPrice(id);
    } else {
      const additionalPrice = additionalPrices.find(
        (price) => price._id === id
      );
      setLoading2(true);
      try {
        const res = await axios.patch(
          `${baseUrl}/api/pricing/additional-prices`,
          { id, price: additionalPrice.price },
          { withCredentials: true, validateStatus: (status) => status < 500 }
        );
        if (res.status !== 200) {
          toast.error(res.data.msg);
        } else {
          toast.success("Additional prices updated successfully");
          setEditAdditionalPrices(false);
        }
      } catch (error) {
        toast.error("Server Error updating additional prices");
      } finally {
        setLoading2(false);
      }
    }
  }

  useEffect(() => {
    getAdditionalPrices();
  }, []);

  useEffect(() => {
    console.log(additionalPrices)
  }, [additionalPrices])

  return (
    <div className="post-order-pricing mx-[5%] h-full flex flex-col gap-8 p-12 ">

      {additionalPrices.map((price) => (
        <PriceInput key={price._id} price={price} updateAdditionalPrices={updateAdditionalPrices} editAdditionalPrices={editAdditionalPrices} selectedAdditionalPrice={selectedAdditionalPrice} />
      )) }

    </div>
  );
};

export default PostOrderPricing;
