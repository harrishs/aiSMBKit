require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to DB and Server. Listening on port " + port);
		app.listen(port);
	})
	.catch((err) => console.log(err));
