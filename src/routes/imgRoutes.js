const express = require("express");
const router = express.Router();
const imgController = require("../controllers/imgController");

router.post("/thumbnail", imgController.generateThumbnail);

module.exports = router;