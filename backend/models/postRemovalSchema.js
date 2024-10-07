const mongoose =  require("mongoose")

const formSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId ,
    required: true,
    ref: 'Users'
  },
    agentFirstName: { type: String, required: true },
    agentLastName: { type: String, required: true },
    email: { type: String, required: true },
    neededByDate: { type: Date, required: true },
    propertyAddress: {
      streetAddress: { type: String, required: true },
      streetAddress2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true }
    },
    additionalInstructions: { type: String }
  })
  
  const postRemovalSchema = mongoose.model('postRemovalForm', formSchema);
  
  module.exports = {postRemovalSchema}
  