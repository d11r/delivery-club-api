import mongoose from "mongoose";

import User from "./user";

const { Schema } = mongoose;

const consumerSchema = new Schema({
  orderedDishes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Dish"
    }
  ]
});

User.Consumer = mongoose.model("Consumer", consumerSchema, "users");

module.exports = User.Consumer;
