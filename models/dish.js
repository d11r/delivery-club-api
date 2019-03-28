import mongoose from "mongoose";

const { Schema } = mongoose;

const dishSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Producer"
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category"
    }
  ]
});

module.exports = mongoose.model("Dish", dishSchema);
