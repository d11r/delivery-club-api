import mongoose from "mongoose";

import User from "./user";

const { Schema } = mongoose;

const producerSchema = new Schema({
  createdDishes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Dish"
    }
  ]
});

User.Producer = mongoose.model("Producer", producerSchema, "users");

module.exports = User.Producer;
