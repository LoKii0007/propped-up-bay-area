const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    formType: {
        type: String,
        enum: [
            'openHouseForm',
            'postOrderForm',
            'postRemovalForm'
        ],
        required: true
    },
    userId: {
        type: String,
        required: true,
        ref: 'Users'
    },
    formData: Object,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { discriminatorKey: 'formType' });

// const Form = mongoose.model('Form', formSchema);

// module.exports = {Form}
