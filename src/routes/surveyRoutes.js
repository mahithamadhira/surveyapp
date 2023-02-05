const express = require("express");
const surveyController = require("../controllers/surveyController");

const router = express.Router();

router.post("/create", surveyController.createSurvey);
router.post("/take", surveyController.takeSurvey);
router.get("/results", surveyController.getResults);
router.get("/results/:id", surveyController.getResultById);

module.exports = router;