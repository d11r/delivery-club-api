import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  dishes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Dish"
    }
  ]
});

module.exports = mongoose.model("Category", categorySchema);
