import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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
  }
});

module.exports = mongoose.model("User", userSchema);
