import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    dishes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dish"
      }
    ],
    consumer: {
      type: Schema.Types.ObjectId,
      ref: "Consumer"
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
