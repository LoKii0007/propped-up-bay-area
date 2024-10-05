const mongoose = require('mongoose')

const formschema = new mongoose.Schema({
    formType: {
        enum : [
            'openHouse',
            'postOrder',
            'postRemoval'
        ],
        required : true
    }, 
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    } , 
    formData: Object, 
    createdAt: {
        Date
    },
    updatedAt: {
        Date
    }
}, { discriminatorKey: 'formType' })

const form = mongoose.model('Form', formschema)

module.exports = form