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
    producer: {
      type: Schema.Types.ObjectId,
      ref: "Producer"
    },
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
