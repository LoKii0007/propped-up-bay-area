const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    orderId : {
        type: mongoose.Schema.Types.ObjectId ,
        required: true,
        ref: 'openHouseForm'
    }, 
    imageUrl : {
        type : String,
        required : true
    }
})

// ImageSchema.index({orderId :1, imageUrl : 1})

const OpenHouseImageSchema = mongoose.model('OpenHouseImage', ImageSchema)

module.exports = OpenHouseImageSchema