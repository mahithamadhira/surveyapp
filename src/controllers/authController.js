const jwt = require("../utils/jwt");

exports.authenticate = (req, res) => {
  const token = jwt.signToken({ id: 1 });
  res.status(200).send({ auth: true, token });
};