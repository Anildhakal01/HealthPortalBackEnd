const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./db/database");
app.use(cors());
const hospitalRoute = require("./routes/hospitalRoute");
const patientRoute = require("./routes/patientRoute");

const path = require("path");
app.use(express.static(path.join(__dirname, "/images")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(hospitalRoute);
app.use(patientRoute);

const PORT = process.env.PORT || 2000;
app.listen(PORT, console.log(`Server running on port : ${PORT}`));
