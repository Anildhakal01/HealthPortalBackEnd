const express = require("express");
const router = express.Router();
const Hospital = require("../models/hospital");
const Appointment = require("../models/appointment");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/upload");
// const auth=require('../middleware/middleware');
//
router.post("/hospital/add", upload.single("himage"), (req, res) => {
  if (req.file == undefined) {
    return res.status(500).json("Invalid file format");
  }

  const name = req.body.hname;
  const desc = req.body.desc;
  const location = req.body.location;
  const email = req.body.email;
  const password = req.body.password;
  const himage = req.file.filename;
  bcrypt.hash(password, 10, function (err, hash) {
    var hdata = new Hospital({
      name: name,
      desc: desc,
      location: location,
      himage: himage,
      email: email,
      password: hash,
    });
    hdata
      .save()
      .then(function (result) {
        res.status(201).json({ success: true });
      })
      .catch(function (e) {
        res.status(500).json({ message: e });
      });
  });
});

router.post("/hospital/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  Hospital.findOne({ email: email })
    .then(function (hospitalData) {
      if (hospitalData == null) {
        return res.status(403).json({ message: "Invalid Credentials!!" });
      }

      bcrypt.compare(password, hospitalData.password, function (err, result) {
        if (result == false) {
          return res.status(403).json({ message: "Invalid Credentials" });
        }
        res.status(200).json({
          success: "true",
          data: hospitalData,
        });
      });
    })
    .catch(function (e) {
      res.status(500).json({ message: e });
    });
});
router.put(
  "/hospital/update/:id",
  upload.single("himage"),
  function (req, res) {
    if (req.file == undefined) {
      return res.status(500).json("Invalid file format");
    }
    const name = req.body.name;

    const location = req.body.location;
    const desc = req.body.desc;
    const email = req.body.email;
    const himage = req.file.filename;
    const hid = req.params.id;
    console.log(hid);
    Hospital.updateOne(
      { _id: hid },
      {
        name: name,
        desc: desc,
        location: location,
        himage: himage,
        email: email,
      }
    )
      .then(function (result) {
        res.status(200).json({ success: true });
      })
      .catch(function (e) {
        res.status(500).json({ message: e });
      });
  }
);

router.delete("/hospital/delete/:_id", function (req, res) {
  const hid = req.params._id;
  Hospital.deleteOne({ _id: hid })
    .then(function (result) {
      res.status(200).json({ message: "Hospital deleted" });
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
});

router.get("/hospital/showall", function (req, res) {
  Hospital.find({})
    .then(function (result) {
      res.status(200).json({ success: true, data: result });
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
});

router.get("/hospital/nearby", function (req, res) {
  Hospital.find({ location: "ktm" })
    .then(function (result) {
      res.status(200).json({ success: true, data: result });
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
});

router.get("/hospital/:id", function (req, res) {
  const id = req.params.id;
  Hospital.find({ _id: id })
    .then(function (result) {
      res.status(200).json({ message: result });
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
});

router.get("/viewAppointments/:id", async function (req, res) {
  const hospitalId = req.params.id;
  const logDoctor = await Appointment.find({
    hospitalId: hospitalId,
    // requestStatus: "Pending",
  })
    .populate("patientId")
    .exec((err, result) => {
      if (err) return handleError(err);
      res.status(201).json({ success: "true", data: result });
    });
});

router.put("/hospital/verifyAppointment", function (req, res) {
  const hospitalId = req.body.hospitalId;
  const patientId = req.body.patientId;
  Appointment.findOne({
    hospitalId: hospitalId,
    patientId: patientId,
  })
    .then(function (result) {
      Appointment.updateOne(
        { hospitalId: hospitalId, patientId: patientId },
        { requestStatus: "Accepted" }
      )
        .then(function (result) {
          res.status(201).json({ success: "true" });
        })
        .catch(function (e) {
          res.status(201).json({
            success: "false",
            message: "Error!!!",
          });
        });
    })
    .catch(function (e) {
      res.status(201).json({
        success: "false",
        message: "Error",
      });
    });
});

router.put("/hospital/rejectAppointment", function (req, res) {
  const hospitalId = req.body.hospitalId;
  const patientId = req.body.patientId;
  Appointment.findOne({
    hospitalId: hospitalId,
    patientId: patientId,
  })
    .then(function (result) {
      Appointment.updateOne(
        { hospitalId: hospitalId, patientId: patientId },
        { requestStatus: "Rejected" }
      )
        .then(function (result) {
          res.status(201).json({ success: "true" });
        })
        .catch(function (e) {
          res.status(201).json({
            success: "false",
            message: "Error!!!",
          });
        });
    })
    .catch(function (e) {
      res.status(201).json({
        success: "false",
        message: "Error",
      });
    });
});

module.exports = router;
