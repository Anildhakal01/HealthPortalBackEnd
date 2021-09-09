const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HospitalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  location: {
    type: String,
  },
  himage: {
    type: String,
    default: "no-photo.jpg",
  },
  email: {
    type: String,
    unique: true,
    autoindex: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = new mongoose.model("Hospital", HospitalSchema);
