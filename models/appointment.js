const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppointmentSchema = new Schema({
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: "Hospital",
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  requestStatus: {
    type: String,
    default: "Pending",
  },
  issue: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
  },

  dateTime: {
    type: String,
  },
});
module.exports = new mongoose.model("Appointment", AppointmentSchema);
