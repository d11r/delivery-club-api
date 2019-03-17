import mongoose from "mongoose";

const { Schema } = mongoose;

const producerSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  business_address: {
    type: String,
    required: false
  },
  website_address: {
    type: String,
    required: false
  },
  phone_number: {
    type: String,
    required: false
  },
  created_dishes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Dish"
    }
  ]
});

module.exports = mongoose.model("Producer", producerSchema);
