const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");

router.post("/patient/add", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const age = req.body.age;
  const gender = req.body.gender;
  const address = req.body.address;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10, function (err, hash) {
    var pdata = new Patient({
      fname: fname,
      lname: lname,
      age: age,
      gender: gender,
      address: address,
      email: email,
      password: hash,
    });
    pdata
      .save()
      .then(function (result) {
        res.status(201).json({ success: true });
      })
      .catch(function (e) {
        res.status(500).json({ message: e });
      });
  });
});
router.post("/patient/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  Patient.findOne({ email: email })
    .then(function (pData) {
      if (pData == null) {
        return res.status(403).json({ message: "Invalid Credentials!!" });
      }
      bcrypt.compare(password, pData.password, function (err, result) {
        if (result == false) {
          return res.status(403).json({ message: "Invalid Credentials" });
        }

        res.status(200).json({
          success: "true",
          data: pData,
        });
      });
    })
    .catch(function (e) {
      res.status(500).json({ message: e });
    });
});
router.put("/patient/update", function (req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const age = req.body.age;
  const gender = req.body.gender;
  const address = req.body.address;
  const email = req.body.email;
  const password = req.body.password;
  const pid = req.body._id;
  console.log(req.body);
  Patient.updateOne(
    { _id: pid },
    {
      fname: fname,
      lname: lname,
      age: age,
      gender: gender,
      address: address,
      email: email,
    }
  )
    .then(function (result) {
      res.status(200).json({ message: "Updated" });
    })
    .catch(function (e) {
      res.status(500).json({ message: e });
    });
});

router.delete("/patient/delete/:_id", function (req, res) {
  const pid = req.params._id;
  Patient.deleteOne({ _id: pid })
    .then(function (result) {
      res.status(200).json({ message: "Hospital deleted" });
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
});

router.get("/patient/showall", function (req, res) {
  Patient.find({})
    .then(function (result) {
      res.status(200).json({ success: true, data: result });
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
});

router.get("/patient/:id", function (req, res) {
  const id = req.params.id;
  Patient.find({ _id: id })
    .then(function (result) {
      res.status(200).json({ message: result });
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
});

router.post("/requestAppointment", async (req, res) => {
  const patientId = req.body.patientId;
  const hospitalId = req.body.hospitalId;
  const issue = req.body.issue;
  const dateTime = req.body.dateTime;
  const doctorName = req.body.doctorName;

  console.log(req.body);
  var apnt = new Appointment({
    patientId: patientId,
    hospitalId: hospitalId,
    dateTime: dateTime,
    issue: issue,
    doctorName: doctorName,
  });

  apnt
    .save()
    .then(() => {
      res.status(201).json({
        success: "true",
      });
    })
    .catch((e) => {
      res.status(201).json({
        success: "false",
        message: e,
      });
    });
});

router.get("/patient/viewAppointments/:id", async function (req, res) {
  const patientId = req.params.id;
  const logDoctor = await Appointment.find({
    patientId: patientId,
  })
    .populate("hospitalId")
    .exec((err, result) => {
      if (err) return res.status(201).json({ success: "false", message: err });
      res.status(201).json({ success: "true", data: result });
    });
});

module.exports = router;
