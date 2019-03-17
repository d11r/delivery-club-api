import mongoose from "mongoose";

const { Schema } = mongoose;

const consumerSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  first_name: {
    type: String,
    required: false
  },
  last_name: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  phone_number: {
    type: String,
    required: false
  },
  ordered_dishes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Dish"
    }
  ]
});

module.exports = mongoose.model("Consumer", consumerSchema);
