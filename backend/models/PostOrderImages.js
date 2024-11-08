const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    orderId : {
        type: mongoose.Schema.Types.ObjectId ,
        required: true,
        ref: 'postOrderForm'
    }, 
    imageUrl : {
        type : String,
        required : true
    }
})

const PostOrderImageSchema = mongoose.model('PostOrderImage', ImageSchema)

module.exports = PostOrderImageSchema