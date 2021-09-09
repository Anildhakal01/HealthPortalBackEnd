const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");

// router.post("/patient/add", (req, res) => {
//   var pdata = new Patient(req.body);
//   pdata.save().then(() => {
//     res.send("Patient Registered");
//   });
// });
router.post("/patient/add", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const age = req.body.age;
  const gender = req.body.gender;
  const address = req.body.address;
  const email = req.body.email;
  const password = req.body.password;
  console.log(lname);
  // const himage=req.file.path;
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
        res.status(201).json({ success: true, data: pdata });
      })
      .catch(function (e) {
        res.status(500).json({ message: e });
      });
  });
});

module.exports = router;
