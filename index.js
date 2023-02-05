const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("./src/utils/jwt");
const authRoutes = require("./src/routes/authRoutes");
const surveyRoutes = require("./src/routes/surveyRoutes");
const dotenv = require("dotenv");
const imgRoutes = require("./src/routes/imgRoutes");

const app = express();
const port = 3000;

dotenv.config();
app.use(bodyParser.json());

app.use(morgan("tiny"));
app.use(helmet());

app.use("/auth/login", authRoutes.login);
app.use("/surveys", jwt.verifyToken, surveyRoutes);
app.use("/api/image", require("./src/routes/imgRoutes"));
//app.use("/img/resize", require("./src/routes/imgRoutes"));

app.listen(port, () => {
  console.log(`Microservice listening on port ${port}`);
});