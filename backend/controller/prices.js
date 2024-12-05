const zonePricesSchema = require("../models/zonePrices");
const SuperUser = require("../models/superUser");
const additionalPricesSchema = require("../models/additionalPrices");

const addZonePrices = async (req, res) => {
  try {
    const { zonePrice, resetPrice, text, name } = req.body;

    const zonePrices = await zonePricesSchema.create({ zonePrice, resetPrice, text, name });
    res.status(200).json(zonePrices);
  } catch (error) {
    console.error("Error adding zone prices:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
}

const getOpenHousePrices = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await SuperUser.findById(userId);

    // Check if user is authorized
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }
    
    const zonePrices = await zonePricesSchema.find();
    res.status(200).json({zonePrices});
  } catch (error) {
    console.error("Error fetching open house prices:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const editOpenHousePrices = async (req, res) => {
  try {
    const { zonePrice, resetPrice, id } = req.body;
    console.log(zonePrice, resetPrice, id);
    const userId = req.user.userId;

    const user = await SuperUser.findById(userId);

    // Check if user is authorized
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const zonePrices = await zonePricesSchema.findByIdAndUpdate(
      id,
      { zonePrice : Number(zonePrice), 
        resetPrice : Number(resetPrice) 
      },
      { new: true }
    );
    res.status(200).json(zonePrices);
  } catch (error) {
    console.error("Error editing open house prices:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const addAdditionalPrices = async (req, res) => {
    try {
      const { name, price } = req.body;
  
      const additionalPrices = await additionalPricesSchema.create({ name, price });
      res.status(200).json(additionalPrices);
    } catch (error) {
      console.error("Error adding zone prices:", error.message);
      res.status(500).json({ msg: "Internal server error" });
    }
  }

  const getAdditionalPrices = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const user = await SuperUser.findById(userId);
  
      // Check if user is authorized
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      if (user.role !== "superuser" && user.role !== "admin") {
        return res.status(401).json({ msg: "Not authorized" });
      }
      
      const additionalPrices = await additionalPricesSchema.find();
      res.status(200).json({additionalPrices});
    } catch (error) {
      console.error("Error fetching open house prices:", error.message);
      res.status(500).json({ msg: "Internal server error" });
    }
  };
  
  const editAdditionalPrices = async (req, res) => {
    try {
      const { price, id } = req.body;
      console.log(price, id);
      const userId = req.user.userId;
  
      const user = await SuperUser.findById(userId);
  
      // Check if user is authorized
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      if (user.role !== "superuser" && user.role !== "admin") {
        return res.status(401).json({ msg: "Not authorized" });
      }
  
      const additionalPrices = await additionalPricesSchema.findByIdAndUpdate(
        id,
        { price : Number(price) },
        { new: true }
      );
      res.status(200).json(additionalPrices);
    } catch (error) {
      console.error("Error editing open house prices:", error.message);
      res.status(500).json({ msg: "Internal server error" });
    }
  };

module.exports = { getOpenHousePrices, editOpenHousePrices, addAdditionalPrices, getAdditionalPrices, editAdditionalPrices };