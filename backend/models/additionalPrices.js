const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    type: {
        type: String,
        required: true,
        enum: ["openHouse", "postOrder", "subscription"]
    },
    priceId: {
        type: String,
        // required: true
    }
})

const additionalPricesSchema = mongoose.model('AdditionalPrices', schema)

module.exports = additionalPricesSchema
